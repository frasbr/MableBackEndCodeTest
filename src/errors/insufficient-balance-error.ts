export default class InsufficientBalanceError extends Error {
    constructor(public data: Data) {
        super('Insufficient balance');
    }
}

interface Data {
    accountId: string;
    balance: number;
    transferAmount: number;
}