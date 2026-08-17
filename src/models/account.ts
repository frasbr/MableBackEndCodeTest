import InsufficientBalanceError from "../errors/insufficient-balance-error";
import ValidationError from "../errors/validation-error";

export default class Account {
    private accountId: string;
    private balance: number;

    constructor(accountId: string, balance: number) {
        Account.validateAccountId(accountId);
        Account.validateBalance(balance);

        this.accountId = accountId;
        this.balance = balance;
    }

    getAccountId(): string {
        return this.accountId;
    }

    getBalance(): number {
        return this.balance;
    }

    addToBalance(amount: number): void {
        this.balance += amount;
    }

    transferToAccount(toAccount: Account, amount: number): void {
        if (amount < 0) {
            throw new ValidationError('Transfer amount must be positive');
        }

        if (this.balance < amount) {
            throw new InsufficientBalanceError({
                accountId: this.accountId,
                balance: this.balance,
                transferAmount: amount,
            });
        }

        this.balance -= amount;
        toAccount.addToBalance(amount);
    }

    private static validateAccountId(accountId: string): void {
        if (!accountId.match(/^[0-9]+$/)) {
            throw new ValidationError('Account ID must be numeric');
        }
        
        if (accountId.length !== 16) {
            throw new ValidationError('Account ID must be 16 characters');
        }
    }

    private static validateBalance(balance: number): void {
        if (isNaN(balance)) {
            throw new ValidationError('Balance must be a number');
        }

        if (balance < 0) {
            throw new ValidationError('Balance must be positive');
        }
    }
}
