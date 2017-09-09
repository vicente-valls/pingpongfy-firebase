import * as Promise from "bluebird";

export interface IDtoValidator {
    /**
     * @param dtoRequest
     * @throws InvalidDto
     * @returns {Promise<void>}
     */
    validate<T>(dtoRequest: T): Promise<void>;
}
