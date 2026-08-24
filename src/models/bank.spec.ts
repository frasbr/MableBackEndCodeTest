import { readFileSync } from 'fs';
import { describe, expect, it, vi } from 'vitest';
import { parseAccounts } from '../parsing/account';
import { parseTransactions } from '../parsing/transaction';
import Account from './account';
import Bank from './bank';
import Transaction from './transaction';
import { FailureMode } from './transaction-result';

const FROM = '1234567890123456';
const TO = '1234567890123457';
const ABSENT = '9999999999999999';

function bankWith(fromBalance: number, toBalance: number): Bank {
    return new Bank([new Account(FROM, fromBalance), new Account(TO, toBalance)]);
}

describe('Bank model', () => {
    describe('constructor (validation)', () => {
        it('should throw an error if a duplicate account id is found', () => {
            expect(() => new Bank([new Account(FROM, 100), new Account(FROM, 50)]))
                .toThrow(`Duplicate account ID ${FROM}`);
        });
    });

    describe('apply', () => {
        it('should move the money and record both sides of the transaction', () => {
            const bank = bankWith(100, 50);

            const result = bank.apply(new Transaction(FROM, TO, 100));

            expect(bank.getBalance(FROM)).toBe(0);
            expect(bank.getBalance(TO)).toBe(150);
            expect(result.toJSON()).toMatchObject({
                amount: 100,
                status: 'COMPLETED',
                failureMode: null,
                fromAccount: { id: FROM, previousBalance: 100, updatedBalance: 0 },
                toAccount: { id: TO, previousBalance: 50, updatedBalance: 150 },
            });
        });

        it('should fail a transaction where the "from" account has insufficient balance', () => {
            const bank = bankWith(100, 50);

            const result = bank.apply(new Transaction(FROM, TO, 101));

            expect(result.succeeded()).toBe(false);
            expect(result.getFailureMode()).toBe(FailureMode.INSUFFICIENT_BALANCE);
            expect(bank.getBalance(FROM)).toBe(100);
            expect(bank.getBalance(TO)).toBe(50);
        });

        it('should fail a transaction where the "from" account is not found', () => {
            const result = bankWith(100, 50).apply(new Transaction(ABSENT, TO, 25));

            expect(result.getFailureMode()).toBe(FailureMode.ACCOUNT_NOT_FOUND);
            expect(result.toJSON().fromAccount).toEqual({ id: ABSENT, previousBalance: null, updatedBalance: null });
        });

        it('should fail a transaction where the "to" account is not found', () => {
            const result = bankWith(100, 50).apply(new Transaction(FROM, ABSENT, 25));

            expect(result.getFailureMode()).toBe(FailureMode.ACCOUNT_NOT_FOUND);
        });

        it('should fail a transaction where something goes wrong', () => {
            const fromAccount = new Account(FROM, 100);
            const bank = new Bank([fromAccount, new Account(TO, 50)]);
            vi.spyOn(fromAccount, 'debit').mockImplementationOnce(() => { throw new Error(); });

            const result = bank.apply(new Transaction(FROM, TO, 20));

            expect(result.getFailureMode()).toBe(FailureMode.UNKNOWN);
            expect(bank.getBalance(FROM)).toBe(100);
        });

        it('should record each application separately if the same transaction is applied twice', () => {
            const bank = bankWith(100, 0);
            const transaction = new Transaction(FROM, TO, 30);

            const first = bank.apply(transaction);
            const second = bank.apply(transaction);

            expect(first.toJSON().fromAccount).toEqual({ id: FROM, previousBalance: 100, updatedBalance: 70 });
            expect(second.toJSON().fromAccount).toEqual({ id: FROM, previousBalance: 70, updatedBalance: 40 });
        });
    });

    describe('process', () => {
        it('should apply every transaction and keep going after a failure', () => {
            const bank = bankWith(100, 0);

            const results = bank.process([
                new Transaction(FROM, TO, 40),
                new Transaction(FROM, TO, 500),
                new Transaction(TO, FROM, 10),
            ]);

            expect(results.map(result => result.succeeded())).toEqual([true, false, true]);
            expect(bank.getBalance(FROM)).toBe(70);
            expect(bank.getBalance(TO)).toBe(30);
        });
    });

    describe('getAccountSnapshots', () => {
        it('should describe every account it holds', () => {
            expect(bankWith(100, 50).getAccountSnapshots()).toEqual([
                { accountId: FROM, balance: 100 },
                { accountId: TO, balance: 50 },
            ]);
        });
    });

    describe('getBalance', () => {
        it('should throw an error for an account it does not hold', () => {
            expect(() => bankWith(100, 50).getBalance(ABSENT)).toThrow(`Account ${ABSENT} not found`);
        });
    });

    describe('a full day of transactions', () => {
        it('should produce the closing balances from the brief', () => {
            const bank = new Bank(parseAccounts(readFileSync('./data/mable_account_balances.csv', 'utf8').trim()));
            const transactions = parseTransactions(readFileSync('./data/mable_transactions.csv', 'utf8').trim());

            bank.process(transactions);

            expect(bank.getBalance('1111234522226789')).toBe(4820.50);
            expect(bank.getBalance('1111234522221234')).toBe(9974.40);
            expect(bank.getBalance('2222123433331212')).toBe(1550.00);
            expect(bank.getBalance('1212343433335665')).toBe(1725.60);
            expect(bank.getBalance('3212343433335755')).toBe(48679.50);
        });
    });
});
