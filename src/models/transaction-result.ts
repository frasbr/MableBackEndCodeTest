import Transaction from "./transaction";

export interface BalanceChange {
    id: string;
    previousBalance: number | null;
    updatedBalance: number | null;
}

export default class TransactionResult {
    private transaction: Transaction;
    private fromAccount: BalanceChange;
    private toAccount: BalanceChange;
    private status: TransactionStatus;
    private failureMode: FailureMode | null;

    private constructor(
        transaction: Transaction,
        fromAccount: BalanceChange,
        toAccount: BalanceChange,
        status: TransactionStatus,
        failureMode: FailureMode | null,
    ) {
        this.transaction = transaction;
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
        this.status = status;
        this.failureMode = failureMode;
    }

    static completed(transaction: Transaction, fromAccount: BalanceChange, toAccount: BalanceChange): TransactionResult {
        return new TransactionResult(transaction, fromAccount, toAccount, TransactionStatus.COMPLETED, null);
    }

    static failed(
        transaction: Transaction,
        fromAccount: BalanceChange,
        toAccount: BalanceChange,
        failureMode: FailureMode,
    ): TransactionResult {
        return new TransactionResult(transaction, fromAccount, toAccount, TransactionStatus.FAILED, failureMode);
    }

    succeeded(): boolean {
        return this.status === TransactionStatus.COMPLETED;
    }

    getFailureMode(): FailureMode | null {
        return this.failureMode;
    }

    toJSON() {
        return {
            id: this.transaction.getId(),
            fromAccount: this.fromAccount,
            toAccount: this.toAccount,
            amount: this.transaction.getAmount(),
            status: this.status,
            failureMode: this.failureMode,
        };
    }
}

export enum FailureMode {
    UNKNOWN = 'UNKNOWN',
    INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
    ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
};

export enum TransactionStatus {
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
};
