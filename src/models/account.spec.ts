import { describe, expect, it } from 'vitest';
import Account from './account';

describe('Account model', () => {

        describe('constructor (validation)', () => {
            it('Should throw an error if the account id is not a number', () => {
                expect(() => new Account('string', 100)).toThrow('Account ID must be numeric');
            });

            it('should throw an error if the account id is not 16 characters', () => {
                expect(() => new Account('1234567890', 100)).toThrow('Account ID must be 16 characters');
            });

            it('should throw an error if the balance is not a number', () => {
                expect(() => new Account('1234567890123456', NaN)).toThrow('Amount must be a number');
            });

            it('should throw an error if the balance is negative', () => {
                expect(() => new Account('1234567890123456', -100)).toThrow('Amount must be positive');
            });

            it('should create an account', () => {
                const account = new Account('1234567890123456', 100);
                expect(account.getAccountId()).toBe('1234567890123456');
                expect(account.getBalance()).toBe(100);
            });
        });

        describe('debit', () => {
            it('should reduce the balance', () => {
                const account = new Account('1234567890123456', 100);
                account.debit(30);

                expect(account.getBalance()).toBe(70);
            });

            it('should allow the balance to be drawn down to zero', () => {
                const account = new Account('1234567890123456', 100);
                account.debit(100);

                expect(account.getBalance()).toBe(0);
            });

            it('should throw an error if the account has insufficient balance', () => {
                const account = new Account('1234567890123456', 100);

                expect(() => account.debit(101)).toThrow('Insufficient balance');
                expect(account.getBalance()).toBe(100);
            });

            it('should throw an error if the amount is negative', () => {
                const account = new Account('1234567890123456', 100);

                expect(() => account.debit(-1)).toThrow('Amount must be positive');
            });
        });

        describe('credit', () => {
            it('should increase the balance', () => {
                const account = new Account('1234567890123456', 100);
                account.credit(50);

                expect(account.getBalance()).toBe(150);
            });

            it('should throw an error if the amount is negative', () => {
                const account = new Account('1234567890123456', 100);

                expect(() => account.credit(-1)).toThrow('Amount must be positive');
            });
        });

        describe('snapshot', () => {
            it('should describe the account without exposing it', () => {
                expect(new Account('1234567890123456', 100).snapshot()).toEqual({
                    accountId: '1234567890123456',
                    balance: 100,
                });
            });
        });
});