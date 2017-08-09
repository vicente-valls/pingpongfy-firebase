export class TableExistingError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, TableExistingError.prototype);
    }
}
