import InsufficientBalanceError from "../errors/insufficient-balance-error";
import ValidationError from "../errors/validation-error";
import Account from "./account";
import Transaction from "./transaction";
import TransactionResult, { BalanceChange, FailureMode } from "./transaction-result";

export default class Bank {
    private accounts: Map<string, Account>;

    constructor(accounts: Account[]) {
        this.accounts = new Map();

        accounts.forEach(account => {
            if (this.accounts.has(account.getAccountId())) {
                throw new ValidationError(`Duplicate account ID ${account.getAccountId()}`);
            }

            this.accounts.set(account.getAccountId(), account);
        });
    }

    process(transactions: Transaction[]): TransactionResult[] {
        return transactions.map(transaction => this.apply(transaction));
    }

    apply(transaction: Transaction): TransactionResult {
        const fromAccount = this.accounts.get(transaction.getFromAccountId());
        const toAccount = this.accounts.get(transaction.getToAccountId());

        if (!fromAccount || !toAccount) {
            return TransactionResult.failed(
                transaction,
                { id: transaction.getFromAccountId(), previousBalance: null, updatedBalance: null },
                { id: transaction.getToAccountId(), previousBalance: null, updatedBalance: null },
                FailureMode.ACCOUNT_NOT_FOUND,
            );
        }

        const fromPreviousBalance = fromAccount.getBalance();
        const toPreviousBalance = toAccount.getBalance();

        try {
            fromAccount.transferToAccount(toAccount, transaction.getAmount());
        } catch (error) {
            return TransactionResult.failed(
                transaction,
                Bank.balanceChange(fromAccount, fromPreviousBalance),
                Bank.balanceChange(toAccount, toPreviousBalance),
                error instanceof InsufficientBalanceError ? FailureMode.INSUFFICIENT_BALANCE : FailureMode.UNKNOWN,
            );
        }

        return TransactionResult.completed(
            transaction,
            Bank.balanceChange(fromAccount, fromPreviousBalance),
            Bank.balanceChange(toAccount, toPreviousBalance),
        );
    }

    getBalance(accountId: string): number {
        const account = this.accounts.get(accountId);

        if (!account) {
            throw new ValidationError(`Account ${accountId} not found`);
        }

        return account.getBalance();
    }

    getAccounts(): Account[] {
        return Array.from(this.accounts.values());
    }

    private static balanceChange(account: Account, previousBalance: number): BalanceChange {
        return {
            id: account.getAccountId(),
            previousBalance,
            updatedBalance: account.getBalance(),
        };
    }
}
