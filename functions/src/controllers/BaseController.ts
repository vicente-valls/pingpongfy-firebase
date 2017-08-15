import {ApiResponseDto} from "../dto/ApiResponseDto";
import {ApiErrorItemResponse} from "../dto/ApiErrorItemResponse";
import * as express from "express";
import {injectable} from "inversify";

@injectable()
export abstract class BaseController {
    protected handleInternalServerError(error: Error, res: express.Response): void {
        let apiResponse = new ApiResponseDto(
            [],
            [new ApiErrorItemResponse(ApiErrorItemResponse.INTERNAL_ERROR, error.message, [])]
        );
        res.status(500).json(apiResponse);
    }
}
