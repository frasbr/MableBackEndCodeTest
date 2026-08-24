import { describe, expect, it } from 'vitest';
import { parseTransactions } from './transaction';

describe('parseTransactions', () => {
    it('should load a transaction per line', () => {
        const csv = '1234567890123456,1234567890123457,25';
        const transactions = parseTransactions(csv);

        expect(transactions).toHaveLength(1);
        expect(transactions[0].getFromAccountId()).toBe('1234567890123456');
        expect(transactions[0].getToAccountId()).toBe('1234567890123457');
        expect(transactions[0].getAmount()).toBe(25);
    });

    it('should not require the accounts to exist', () => {
        const csv = '9999999999999999,1234567890123457,25';

        expect(parseTransactions(csv)).toHaveLength(1);
    });

    it('should throw an error if a line contains an invalid amount', () => {
        const csv = '1234567890123456,1234567890123457,notanumber';

        expect(() => parseTransactions(csv)).toThrow('Amount must be a number');
    });
});
