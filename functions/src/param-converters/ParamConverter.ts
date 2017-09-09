import * as express from "express";
import {ClassTransformer} from "class-transformer";
import {ApiErrorItemResponse} from "../dto/ApiErrorItemResponse";
import {ApiResponseDto} from "../dto/ApiResponseDto";
import {ClassType} from "class-transformer/ClassTransformer";
import {provide} from "../../ioc/IoC";
import SYMBOLS from "../../ioc/Symbols";
import {inject} from "inversify";

@provide(SYMBOLS.ParamConverter)
export class ParamConverter {
    constructor(@inject(SYMBOLS.ClassTransformer) private classTransformer: ClassTransformer) {
    }
    convert<T>(paramName: string, classType: ClassType<T>): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
                req.body[paramName] = this.classTransformer.plainToClass<T, Object>(classType, req.body);
                next();
            } catch (error) {
                console.log("invalid dto sent: ", JSON.stringify(req.body));
                res.status(400).json(
                    new ApiResponseDto(
                        [],
                        [new ApiErrorItemResponse(ApiErrorItemResponse.VALIDATION_ERROR, error.message, [])]
                    )
                );
            }
        };
    }
}
