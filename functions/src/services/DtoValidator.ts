import {inject} from "inversify";
import {Validator} from "class-validator";
import * as Promise from "bluebird";
import {provide} from "../../ioc/IoC";
import SYMBOLS from "../../ioc/Symbols";
import {IDtoValidator} from "./IDtoValidator";
import {InvalidDtoError} from "../errors/InvalidDtoError";

@provide(SYMBOLS.DtoValidator)
export class DtoValidator implements IDtoValidator {
    constructor(
        @inject(SYMBOLS.Validator) private validator: Validator
    ) {
    }

    public validate<T>(dtoRequest: T): Promise<void> {
        return Promise
        .resolve(this.validator.validateOrReject(dtoRequest))
        .catch((errors) => {
            throw new InvalidDtoError(errors, "invalid dto");
        });
    }
}
