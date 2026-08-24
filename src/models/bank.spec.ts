import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
import { loadAccountMapFromCSV } from '../parsing/account';
import { loadTransactionsArrayFromCSV } from '../parsing/transaction';
import Account from './account';
import Bank from './bank';
import Transaction from './transaction';

const FROM = '1234567890123456';
const TO = '1234567890123457';
const ABSENT = '9999999999999999';

function bankWith(fromBalance: number, toBalance: number): Bank {
    const accounts = [new Account(FROM, fromBalance), new Account(TO, toBalance)];

    return new Bank(new Map(accounts.map(account => [account.getAccountId(), account])));
}

describe('Bank model', () => {
    describe('process', () => {
        it('should apply every transaction and keep going after a failure', () => {
            const bank = bankWith(100, 0);
            const [fromAccount, toAccount] = bank.getAccounts();
            const transactions = [
                new Transaction(fromAccount, toAccount, 40),
                new Transaction(fromAccount, toAccount, 500),
                new Transaction(toAccount, fromAccount, 10),
            ];

            bank.process(transactions);

            expect(transactions.map(transaction => transaction.succeeded())).toEqual([true, false, true]);
            expect(bank.getBalance(FROM)).toBe(70);
            expect(bank.getBalance(TO)).toBe(30);
        });
    });

    describe('getBalance', () => {
        it('should throw an error for an account it does not hold', () => {
            expect(() => bankWith(100, 50).getBalance(ABSENT)).toThrow(`Account ${ABSENT} not found`);
        });
    });

    describe('getAccounts', () => {
        it('should return every account it holds', () => {
            expect(bankWith(100, 50).getAccounts().map(account => account.getAccountId())).toEqual([FROM, TO]);
        });
    });

    describe('a full day of transactions', () => {
        it('should produce the closing balances from the brief', () => {
            const accountMap = loadAccountMapFromCSV(readFileSync('./data/mable_account_balances.csv', 'utf8').trim());
            const transactions = loadTransactionsArrayFromCSV(
                readFileSync('./data/mable_transactions.csv', 'utf8').trim(),
                accountMap,
            );
            const bank = new Bank(accountMap);

            bank.process(transactions);

            expect(bank.getBalance('1111234522226789')).toBe(4820.50);
            expect(bank.getBalance('1111234522221234')).toBe(9974.40);
            expect(bank.getBalance('2222123433331212')).toBe(1550.00);
            expect(bank.getBalance('1212343433335665')).toBe(1725.60);
            expect(bank.getBalance('3212343433335755')).toBe(48679.50);
        });
    });
});
