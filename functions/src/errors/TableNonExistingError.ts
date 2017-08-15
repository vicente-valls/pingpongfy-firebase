export class TableNonExistingError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, TableNonExistingError.prototype);
    }
}
