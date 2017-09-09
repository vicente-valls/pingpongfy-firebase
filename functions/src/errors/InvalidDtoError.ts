import {ValidationErrorItem} from "./ValidationErrorItem";

export class InvalidDtoError extends Error {
    public readonly errors: ValidationErrorItem[];

    constructor(errors: ValidationErrorItem[], message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidDtoError.prototype);
        this.errors = errors;
    }
}
