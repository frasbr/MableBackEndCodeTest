import ValidationError from "../errors/validation-error";
import Account from "../models/account";
import Transaction from "../models/transaction";

export function loadTransactionsArrayFromCSV(csv: string, accountMap: Map<string, Account>): Transaction[] {
    return csv.split('\n').map(line => {
        const [fromAccountId, toAccountId, amount] = line.split(',');
        const fromAccount = accountMap.get(fromAccountId);
        const toAccount = accountMap.get(toAccountId);

        if (!fromAccount) {
            throw new ValidationError(`Account ${fromAccountId} not found`);
        }

        if (!toAccount) {
            throw new ValidationError(`Account ${toAccountId} not found`);
        }

        return new Transaction(fromAccount, toAccount, parseFloat(amount));
    });
}
