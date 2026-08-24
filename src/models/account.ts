import InsufficientBalanceError from "../errors/insufficient-balance-error";
import ValidationError from "../errors/validation-error";

export interface AccountSnapshot {
    accountId: string;
    balance: number;
}

export default class Account {
    private accountId: string;
    private balance: number;

    constructor(accountId: string, balance: number) {
        Account.validateAccountId(accountId);
        Account.validateAmount(balance);

        this.accountId = accountId;
        this.balance = balance;
    }

    getAccountId(): string {
        return this.accountId;
    }

    getBalance(): number {
        return this.balance;
    }

    debit(amount: number): void {
        Account.validateAmount(amount);

        if (amount > this.balance) {
            throw new InsufficientBalanceError({
                accountId: this.accountId,
                balance: this.balance,
                transferAmount: amount,
            });
        }

        this.balance -= amount;
    }

    credit(amount: number): void {
        Account.validateAmount(amount);

        this.balance += amount;
    }

    snapshot(): AccountSnapshot {
        return {
            accountId: this.accountId,
            balance: this.balance,
        };
    }

    private static validateAccountId(accountId: string): void {
        if (!accountId.match(/^[0-9]+$/)) {
            throw new ValidationError('Account ID must be numeric');
        }
        
        if (accountId.length !== 16) {
            throw new ValidationError('Account ID must be 16 characters');
        }
    }

    private static validateAmount(amount: number): void {
        if (isNaN(amount)) {
            throw new ValidationError('Amount must be a number');
        }

        if (amount < 0) {
            throw new ValidationError('Amount must be positive');
        }
    }
}
