import ValidationError from "../errors/validation-error";
import Account from "./account";
import Transaction from "./transaction";

export default class Bank {
    private accounts: Map<string, Account>;

    constructor(accounts: Map<string, Account>) {
        this.accounts = accounts;
    }

    process(transactions: Transaction[]): void {
        transactions.forEach(transaction => transaction.execute());
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
}
