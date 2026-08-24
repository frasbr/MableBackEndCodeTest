import ValidationError from "../errors/validation-error";

export default class Transaction {
    private id: string;

    constructor(private fromAccountId: string, private toAccountId: string, private amount: number) {
        Transaction.validateAmount(amount);

        this.id = crypto.randomUUID();
    }

    getId(): string {
        return this.id;
    }

    getFromAccountId(): string {
        return this.fromAccountId;
    }

    getToAccountId(): string {
        return this.toAccountId;
    }

    getAmount(): number {
        return this.amount;
    }

    private static validateAmount(amount: number): void {
        if (isNaN(amount)) {
            throw new ValidationError('Amount must be a number');
        }

        if (amount < 0) {
            throw new ValidationError('Amount must be positive');
        }
    }
}
