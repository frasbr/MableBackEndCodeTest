import { describe, expect, it } from 'vitest';
import Account from '../models/account';
import { loadTransactionsArrayFromCSV } from './transaction';

describe('loadTransactionsArrayFromCSV', () => {
    it('should load an array of transactions', () => {
        const fromAccount = new Account('1234567890123456', 100);
        const toAccount = new Account('1234567890123457', 50);
        const accountMap = new Map([
            [fromAccount.getAccountId(), fromAccount],
            [toAccount.getAccountId(), toAccount],
        ]);
        const csv = '1234567890123456,1234567890123457,25';

        const transactions = loadTransactionsArrayFromCSV(csv, accountMap);

        expect(transactions).toHaveLength(1);
        const transactionObj = transactions[0].toJSON();
        expect(transactionObj.fromAccount.id).toBe('1234567890123456');
        expect(transactionObj.toAccount.id).toBe('1234567890123457');
        expect(transactionObj.amount).toBe(25);
    });

    it('should throw an error if the "from" account is not found', () => {
        const toAccount = new Account('1234567890123457', 50);
        const accountMap = new Map([[toAccount.getAccountId(), toAccount]]);
        const csv = '1234567890123456,1234567890123457,25';

        expect(() => loadTransactionsArrayFromCSV(csv, accountMap)).toThrow('Account 1234567890123456 not found');
    });

    it('should throw an error if the "to" account is not found', () => {
        const fromAccount = new Account('1234567890123456', 100);
        const accountMap = new Map([[fromAccount.getAccountId(), fromAccount]]);
        const csv = '1234567890123456,1234567890123457,25';

        expect(() => loadTransactionsArrayFromCSV(csv, accountMap)).toThrow('Account 1234567890123457 not found');
    });
});
