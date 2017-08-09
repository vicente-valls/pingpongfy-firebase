import {ValidationErrorItem} from "./ValidationErrorItem";

export class ApiErrorItemResponse {
    static VALIDATION_ERROR = "VALIDATION_ERROR";
    static INTERNAL_ERROR = "INTERNAL_ERROR";

    constructor(
        public readonly code: string,
        public readonly message: string,
        public readonly validationErrors: ValidationErrorItem[]
    ) {
    }
}
