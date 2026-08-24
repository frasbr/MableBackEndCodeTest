import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import Bank from './models/bank';
import TransactionResult from './models/transaction-result';
import { parseAccounts } from './parsing/account';
import { parseTransactions } from './parsing/transaction';

const ACCOUNT_BALANCE_CSV_PATH = './data/mable_account_balances.csv';
const TRANSACTIONS_CSV_PATH = './data/mable_transactions.csv';
const OUTPUT_DIR = 'output';

function main(): void {
    const bank = new Bank(parseAccounts(readFileSync(ACCOUNT_BALANCE_CSV_PATH, 'utf8').trim()));
    const transactions = parseTransactions(readFileSync(TRANSACTIONS_CSV_PATH, 'utf8').trim());

    const results = bank.process(transactions);

    write('transactions.json', results);
    write('new_balances.json', bank.getAccounts());
    report(results);
}

function write(fileName: string, contents: unknown): void {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(`${OUTPUT_DIR}/${fileName}`, JSON.stringify(contents, null, 4));
}

function report(results: TransactionResult[]): void {
    const failed = results.filter(result => !result.succeeded());

    failed.forEach(result => {
        console.error('Transaction failed', { transaction: result.toJSON() });
    });

    console.log(`Processed ${results.length} transactions: ${results.length - failed.length} completed, ${failed.length} failed`);
    console.log(`See \`${OUTPUT_DIR}/\` for results`);
}

main();
