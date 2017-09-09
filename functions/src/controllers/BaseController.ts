import {ApiResponseDto} from "../dto/ApiResponseDto";
import {ApiErrorItemResponse} from "../dto/ApiErrorItemResponse";
import * as express from "express";
import {injectable} from "inversify";
import {InvalidDtoError} from "../errors/InvalidDtoError";
import {ValidationErrorItem} from "../errors/ValidationErrorItem";

@injectable()
export abstract class BaseController {
    protected handleInternalServerError(error: Error, res: express.Response): void {
        let apiResponse = new ApiResponseDto(
            [],
            [new ApiErrorItemResponse(ApiErrorItemResponse.INTERNAL_ERROR, error.message, [])]
        );
        res.status(500).json(apiResponse);
    }

    protected handleValidationErrors(invalidDtoError: InvalidDtoError, res: express.Response): void {
        let validationErrorItems = invalidDtoError.errors.map((validationError: ValidationErrorItem) => {
            return new ValidationErrorItem(validationError.property, validationError.value,
                validationError.constraints
            );
        });
        res.status(400).json(
            new ApiResponseDto(
                [], [new ApiErrorItemResponse(ApiErrorItemResponse.VALIDATION_ERROR, "", validationErrorItems)]
            )
        );
    }
}
