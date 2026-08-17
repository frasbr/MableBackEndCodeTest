import { describe, expect, it, vi } from 'vitest';
import Account from './account';
import Transaction from './transaction';

describe('Transaction model', () => {
    describe('constructor (validation)', () => {
        it('should throw an error if the transaction amount is negative', () => {
            expect(() => new Transaction(new Account('1234567890123456', 100), new Account('1234567890123457', 50), -1)).toThrow('Amount must be positive');
        });

        it('should throw an error if the transaction amount is not a number', () => {
            expect(() => new Transaction(new Account('1234567890123456', 100), new Account('1234567890123457', 50), NaN)).toThrow('Amount must be a number');
        });
    });

    describe('execute', () => {
        it('execute a transcation between two accounts', () => {
            const fromAccount = new Account('1234567890123456', 100);
            const toAccount = new Account('1234567890123457', 50);
            const transaction = new Transaction(fromAccount, toAccount, 100);
            transaction.execute();

            expect(fromAccount.getBalance()).toBe(0);
            expect(toAccount.getBalance()).toBe(150);

            const transactionObj = transaction.toJSON();
            expect(transactionObj.status).toBe('COMPLETED');
            expect(transactionObj.failureMode).toBe(null);
        });

        it('executes a transcation between two accounts where the "from" account has insufficient balance', () => {
            const fromAccount = new Account('1234567890123456', 100);
            const toAccount = new Account('1234567890123457', 50);
            const transaction = new Transaction(fromAccount, toAccount, 101);
            transaction.execute();

            // balances are unchanged
            expect(fromAccount.getBalance()).toBe(100);
            expect(toAccount.getBalance()).toBe(50);

            const transactionObj = transaction.toJSON();
            expect(transactionObj.status).toBe('FAILED');
            expect(transactionObj.failureMode).toBe('INSUFFICIENT_BALANCE');
        });

        it('executes a transaction where something goes wrong', () => {
            const fromAccount = new Account('1234567890123456', 100);
            const toAccount = new Account('1234567890123457', 50);
            const transaction = new Transaction(fromAccount, toAccount, 20);
            const og = fromAccount.transferToAccount;
            fromAccount.transferToAccount = vi.fn().mockImplementation(() => { throw new Error() });
            transaction.execute();

            // balances are unchanged
            expect(fromAccount.getBalance()).toBe(100);
            expect(toAccount.getBalance()).toBe(50);

            const transactionObj = transaction.toJSON();
            expect(transactionObj.status).toBe('FAILED');
            expect(transactionObj.failureMode).toBe('UNKNOWN');

            fromAccount.transferToAccount = og;
        });
    });
});