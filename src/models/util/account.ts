import ValidationError from "../../errors/validation-error";
import Account from "../account";

export function loadAccountMapFromCSV(csv: string): Map<string, Account> {
    const map = new Map<string, Account>();

    csv.split('\n').forEach(line => {
        const [accountId, balance] = line.split(','); // this can easily fall down
        try {
            const acc = new Account(accountId, parseFloat(balance));
            if (map.has(accountId)) {
                throw new ValidationError(`Duplicate account ID ${accountId}`);
            }
            map.set(accountId, acc);
        } catch (e) {
            console.error('Error while loading account', { accountId, balance, error: e });
            throw e;
        }
    });
    
    return map;
}