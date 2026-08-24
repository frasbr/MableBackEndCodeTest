import Transaction from "../models/transaction";

export function parseTransactions(csv: string): Transaction[] {
    return csv.split('\n').map(line => {
        const [fromAccountId, toAccountId, amount] = line.split(',');

        return new Transaction(fromAccountId, toAccountId, parseFloat(amount));
    });
}
