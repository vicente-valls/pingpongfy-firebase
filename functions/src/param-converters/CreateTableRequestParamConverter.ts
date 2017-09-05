import * as express from "express";
import {plainToClass} from "class-transformer";
import {validateSync, ValidationError} from "class-validator";
import {CreateTableRequestDto} from "../dto/CreateTableRequestDto";
import {ApiErrorItemResponse} from "../dto/ApiErrorItemResponse";
import {ApiResponseDto} from "../dto/ApiResponseDto";
import {ValidationErrorItem} from "../dto/ValidationErrorItem";
export const CREATE_TABLE = "createTable";

export function CreateTableRequestParamConverter(): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let createTableRequestDto = plainToClass(CreateTableRequestDto, req.body);
            let validationErrors = validateSync(createTableRequestDto, { validationError: { target: false } });
            if (validationErrors.length === 0) {
                // all is good
                req.body[CREATE_TABLE] = createTableRequestDto;
                next();
            } else {
                handleResponseForValidationErrors(validationErrors, res);
            }
        } catch (error) {
            res.status(400).json(
                new ApiResponseDto(
                    [],
                    [new ApiErrorItemResponse(ApiErrorItemResponse.VALIDATION_ERROR, error.message, [])]
                )
            );
        }
    };
}

function handleResponseForValidationErrors(validationErrors: ValidationError[], res: express.Response): void {
    let validationErrorItems = validationErrors.map((validationError: ValidationError) => {
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
