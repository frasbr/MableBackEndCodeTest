import { describe, expect, it } from 'vitest';
import { loadAccountMapFromCSV } from './account';

describe('loadAccountMapFromCSV', () => {
    it('should load a map of accounts keyed by account id', () => {
        const csv = '1234567890123456,100\n1234567890123457,50';
        const map = loadAccountMapFromCSV(csv);

        expect(map.size).toBe(2);
        expect(map.get('1234567890123456')?.getBalance()).toBe(100);
        expect(map.get('1234567890123457')?.getBalance()).toBe(50);
    });

    it('should throw an error if a line contains an invalid account id', () => {
        const csv = 'notanumber,100';

        expect(() => loadAccountMapFromCSV(csv)).toThrow('Account ID must be numeric');
    });

    it('should throw an error if a duplicate account id is found', () => {
        const csv = '1234567890123456,100\n1234567890123456,50';

        expect(() => loadAccountMapFromCSV(csv)).toThrow('Duplicate account ID 1234567890123456');
    });
});
