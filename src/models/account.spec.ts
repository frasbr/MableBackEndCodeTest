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
                expect(() => new Account('1234567890123456', NaN)).toThrow('Balance must be a number');
            });

            it('should throw an error if the balance is negative', () => {
                expect(() => new Account('1234567890123456', -100)).toThrow('Balance must be positive');
            });

            it('should create an account', () => {
                const account = new Account('1234567890123456', 100);
                expect(account.getAccountId()).toBe('1234567890123456');
                expect(account.getBalance()).toBe(100);
            });
        });

        describe('addToBalance', () => {
            it('should update balance', () => {
                const account = new Account('1234567890123456', 100);
                account.addToBalance(50);
                expect(account.getBalance()).toBe(150);
            });
        });

        describe('transferToAccount', () => {
            it('should throw an error if the account has insufficient balance', () => {
                const fromAccount = new Account('1234567890123456', 100);
                const toAccount = new Account('1234567890123457', 50);

                expect(() => fromAccount.transferToAccount(toAccount, 101)).toThrow('Insufficient balance');
            });

            it('should throw an error if the transaction amount is negative', () => {
                const fromAccount = new Account('1234567890123456', 100);
                const toAccount = new Account('1234567890123457', 50);                
                expect(() => fromAccount.transferToAccount(toAccount, -1)).toThrow('Transfer amount must be positive');
            });

            it('should transfer funds where amount is equal to account balance', () => {
                const fromAccount = new Account('1234567890123456', 100);
                const toAccount = new Account('1234567890123457', 50);
                fromAccount.transferToAccount(toAccount, 100);

                expect(fromAccount.getBalance()).toBe(0);
                expect(toAccount.getBalance()).toBe(150);
            });
        });
});