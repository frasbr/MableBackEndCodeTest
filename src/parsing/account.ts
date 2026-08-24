import Account from "../models/account";

export function parseAccounts(csv: string): Account[] {
    return csv.split('\n').map(line => {
        const [accountId, balance] = line.split(','); // this can easily fall down

        return new Account(accountId, parseFloat(balance));
    });
}
