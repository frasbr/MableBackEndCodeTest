import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { loadAccountMapFromCSV } from './parsing/account';
import { loadTransactionsArrayFromCSV } from './parsing/transaction';

// Read data from CSV files
const ACCOUNT_BALANCE_CSV = readFileSync('./data/mable_account_balances.csv', 'utf8').trim();
const TRANSACTIONS_CSV = readFileSync('./data/mable_transactions.csv', 'utf8').trim();

// Load data into models
const accountMap = loadAccountMapFromCSV(ACCOUNT_BALANCE_CSV);
const transactions = loadTransactionsArrayFromCSV(TRANSACTIONS_CSV, accountMap);

transactions.forEach(txn => txn.execute());

mkdirSync('output', { recursive: true });
writeFileSync('output/transactions.json', JSON.stringify(transactions.map(t => t.toJSON()), null, 4));
const accounts = Array.from(accountMap.values());
writeFileSync('output/new_balances.json', JSON.stringify(accounts, null, 4));
console.log('Transactions processed. See `output/` for results');
