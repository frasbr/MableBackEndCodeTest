import { describe, expect, it } from 'vitest';
import { parseAccounts } from './account';

describe('parseAccounts', () => {
    it('should load an account per line', () => {
        const csv = '1234567890123456,100\n1234567890123457,50';
        const accounts = parseAccounts(csv);

        expect(accounts).toHaveLength(2);
        expect(accounts[0].getAccountId()).toBe('1234567890123456');
        expect(accounts[0].getBalance()).toBe(100);
        expect(accounts[1].getBalance()).toBe(50);
    });

    it('should throw an error if a line contains an invalid account id', () => {
        const csv = 'notanumber,100';

        expect(() => parseAccounts(csv)).toThrow('Account ID must be numeric');
    });
});
