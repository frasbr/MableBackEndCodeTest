# How to run

1. Install node
2. Run `npm ci` to install dependencies
3. Run main program via `npm start`
    - Results are written to the `output/` directory
4. Run `npm run test`

# Assumptions

1. Transactions are to be applied in file order
2. Exceptions are only thrown on corrupted data. Failed transactions are recorded
3. CSVs will always have the same shape

# Other notes

1. I didnt bother converting the amounts to integer cents as would normally be standard practice 
2. transaction executions are not atomic. Debiting and crediting are separate steps which could possibly fail independently
3. csv parser is naive
