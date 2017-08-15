import * as express from "express";
import {plainToClass} from "class-transformer";
import {validateSync, ValidationError} from "class-validator";
import {ApiErrorItemResponse} from "../dto/ApiErrorItemResponse";
import {ApiResponseDto} from "../dto/ApiResponseDto";
import {ValidationErrorItem} from "../dto/ValidationErrorItem";
import {UpdateTableRequestDto} from "../dto/UpdateTableRequestDto";
export const UPDATE_TABLE = "updateTable";

export function UpdateTableRequestParamConverter(): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            let requestDto = plainToClass(UpdateTableRequestDto, req.body);
            console.log("requestDto", req.body);
            let validationErrors = validateSync(requestDto, { validationError: { target: false } });
            if (validationErrors.length === 0) {
                // all is good
                req.body[UPDATE_TABLE] = requestDto;
                next();
            } else {
                let validationErrorItems = validationErrors.map((validationError: ValidationError) => {
                    return new ValidationErrorItem(
                        validationError.property,
                        validationError.value,
                        validationError.constraints
                    );
                });
                res.status(400).json(
                    new ApiResponseDto(
                        [],
                        [new ApiErrorItemResponse(ApiErrorItemResponse.VALIDATION_ERROR, "", validationErrorItems)]
                    )
                );
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
