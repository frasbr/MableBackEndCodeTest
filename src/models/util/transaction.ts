import ValidationError from "../../errors/validation-error";
import Account from "../account";
import Transaction from "../transaction";

export function loadTransactionsArrayFromCSV(csv: string, accountMap: Map<string, Account>): Transaction[] {
    return csv.split('\n').map(line => {
        const [fromAccountId, toAccountId, amount] = line.split(',');
        const fromAccount = accountMap.get(fromAccountId);
        const toAccount = accountMap.get(toAccountId);

        if (!fromAccount) {
            console.error('Error while loading transaction', { fromAccountId, toAccountId, amount });   
            throw new ValidationError(`Account ${fromAccountId} not found`);
        }

        if (!toAccount) {
            console.error('Error while loading transaction', { fromAccountId, toAccountId, amount });
            throw new ValidationError(`Account ${toAccountId} not found`);
        }

        return new Transaction(fromAccount, toAccount, parseFloat(amount));
    });
}