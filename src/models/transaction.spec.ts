import { describe, expect, it } from 'vitest';
import Transaction from './transaction';

describe('Transaction model', () => {
    describe('constructor (validation)', () => {
        it('should throw an error if the transaction amount is negative', () => {
            expect(() => new Transaction('1234567890123456', '1234567890123457', -1)).toThrow('Amount must be positive');
        });

        it('should throw an error if the transaction amount is not a number', () => {
            expect(() => new Transaction('1234567890123456', '1234567890123457', NaN)).toThrow('Amount must be a number');
        });

        it('should create a transaction', () => {
            const transaction = new Transaction('1234567890123456', '1234567890123457', 25);

            expect(transaction.getId()).toEqual(expect.any(String));
            expect(transaction.getFromAccountId()).toBe('1234567890123456');
            expect(transaction.getToAccountId()).toBe('1234567890123457');
            expect(transaction.getAmount()).toBe(25);
        });
    });
});
