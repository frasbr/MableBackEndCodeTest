import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import Bank from './models/bank';
import Transaction from './models/transaction';
import { loadAccountMapFromCSV } from './parsing/account';
import { loadTransactionsArrayFromCSV } from './parsing/transaction';

const ACCOUNT_BALANCE_CSV_PATH = './data/mable_account_balances.csv';
const TRANSACTIONS_CSV_PATH = './data/mable_transactions.csv';
const OUTPUT_DIR = 'output';

function main(): void {
    const accountMap = loadAccountMapFromCSV(readFileSync(ACCOUNT_BALANCE_CSV_PATH, 'utf8').trim());
    const transactions = loadTransactionsArrayFromCSV(readFileSync(TRANSACTIONS_CSV_PATH, 'utf8').trim(), accountMap);

    const bank = new Bank(accountMap);
    bank.process(transactions);

    write('transactions.json', transactions);
    write('new_balances.json', bank.getAccounts());
    report(transactions);
}

function write(fileName: string, contents: unknown): void {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(`${OUTPUT_DIR}/${fileName}`, JSON.stringify(contents, null, 4));
}

function report(transactions: Transaction[]): void {
    const failed = transactions.filter(transaction => !transaction.succeeded());

    failed.forEach(transaction => {
        console.error('Transaction failed', { transaction: transaction.toJSON() });
    });

    console.log(`Processed ${transactions.length} transactions: ${transactions.length - failed.length} completed, ${failed.length} failed`);
    console.log(`See \`${OUTPUT_DIR}/\` for results`);
}

main();
