import ValidationError from "../errors/validation-error";
import Account from "../models/account";

export function loadAccountMapFromCSV(csv: string): Map<string, Account> {
    const map = new Map<string, Account>();

    csv.split('\n').forEach(line => {
        const [accountId, balance] = line.split(','); // this can easily fall down
        if (map.has(accountId)) {
            throw new ValidationError(`Duplicate account ID ${accountId}`);
        }

        map.set(accountId, new Account(accountId, parseFloat(balance)));
    });

    return map;
}
