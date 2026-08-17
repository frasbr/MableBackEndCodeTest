import Account from "./account";
import InsufficientBalanceError from "../errors/insufficient-balance-error";
import ValidationError from "../errors/validation-error";

export default class Transaction {
    private id: string;

    private fromAccount: Account;
    private fromAccountPreviousBalance: number;
    private fromAccountUpdatedBalance?: number;

    private toAccount: Account;
    private toAccountPreviousBalance: number;
    private toAccountUpdatedBalance?: number;

    private transactionAmount: number;

    private status: TransactionStatus;
    private failureMode: FailureMode | null = null;

    constructor(fromAccount: Account, toAccount: Account, amount: number) {
        Transaction.validateAmount(amount);

        this.id = crypto.randomUUID();
        this.status = TransactionStatus.PENDING;

        this.fromAccount = fromAccount;
        this.fromAccountPreviousBalance = fromAccount.getBalance();

        this.toAccount = toAccount;
        this.toAccountPreviousBalance = toAccount.getBalance();

        this.transactionAmount = amount;
    }

    execute(): void {
        this.fromAccountPreviousBalance = this.fromAccount.getBalance();
        this.toAccountPreviousBalance = this.toAccount.getBalance();
        try {
            this.fromAccount.transferToAccount(this.toAccount, this.transactionAmount);
            this.status = TransactionStatus.COMPLETED;
        } catch (error) {
            console.log('Error processing transaction', { transactionId: this.id, error });
            if (error instanceof InsufficientBalanceError) {
                this.failureMode = FailureMode.INSUFFICIENT_BALANCE;
            } else {
                this.failureMode = FailureMode.UNKNOWN;
            }
            this.status = TransactionStatus.FAILED;
        } finally {
            this.fromAccountUpdatedBalance = this.fromAccount.getBalance();
            this.toAccountUpdatedBalance = this.toAccount.getBalance();
        }
    }

    toJSON() {
        return {
            id: this.id,
            fromAccount: {
                id: this.fromAccount.getAccountId(),
                previousBalance: this.fromAccountPreviousBalance,
                updatedBalance: this.fromAccountUpdatedBalance,
            },
            toAccount: {
                id: this.toAccount.getAccountId(),
                previousBalance: this.toAccountPreviousBalance,
                updatedBalance: this.toAccountUpdatedBalance,
            },
            amount: this.transactionAmount,
            status: this.status,
            failureMode: this.failureMode,
        };
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

enum FailureMode {
    UNKNOWN = 'UNKNOWN',
    INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
};

enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
};