import {
    TYPE, controller, httpGet, interfaces, response, httpPost, requestBody,
    httpDelete, requestParam, httpPut
} from "inversify-express-utils";
import {provideNamed} from "../../ioc/IoC";
import TAGS from "../../ioc/Tags";
import * as express from "express";
import {TableService} from "../services/TableService";
import {inject} from "inversify";
import {ApiResponseDto} from "../dto/ApiResponseDto";
import SYMBOLS from "../../ioc/Symbols";
import {TableListItem} from "../dto/TableListItem";
import {ClassTransformer} from "class-transformer";
import * as bodyParser from "body-parser";
import {CREATE_TABLE, CreateTableRequestParamConverter} from "../param-converters/CreateTableRequestParamConverter";
import {CreateTableRequestDto} from "../dto/CreateTableRequestDto";
import {TableExistingError} from "../errors/TableExistingError";
import {ApiErrorItemResponse} from "../dto/ApiErrorItemResponse";
import {ValidationErrorItem} from "../dto/ValidationErrorItem";
import {BaseController} from "./BaseController";
import {UPDATE_TABLE, UpdateTableRequestParamConverter} from "../param-converters/UpdateTableRequestParamConverter";
import {UpdateTableRequestDto} from "../dto/UpdateTableRequestDto";
import {TableNonExistingError} from "../errors/TableNonExistingError";

@provideNamed(TYPE.Controller, TAGS.TableController)
@controller("/v1/tables")
export class TableController extends BaseController implements interfaces.Controller {
    constructor(
        @inject(SYMBOLS.TableService) private tableService: TableService,
        @inject(SYMBOLS.ClassTransformer) private classTransformer: ClassTransformer
    ) {
        super();
    }

    // @todo implement authentication
    @httpGet("/")
    getTables(@response() res: express.Response): Promise<void> {
        return Promise.resolve<TableListItem[]>(this.tableService.getTables())
        .then((tableItems) => {
            let apiResponse = new ApiResponseDto(tableItems);
            res.json(this.classTransformer.classToPlain(apiResponse));
        })
        .catch((error: Error) => {
            this.handleInternalServerError(error, res);
        })
        ;
    }

    // @todo implement authentication
    @httpPost("/", bodyParser.json(), CreateTableRequestParamConverter())
    createTable(
        @requestBody(CREATE_TABLE) createTableDto: CreateTableRequestDto,
        @response() res: express.Response
    ): Promise<void> {
        return Promise.resolve<TableListItem>(this.tableService.createTable(createTableDto))
        .then((tableItem) => {
            let apiResponse = new ApiResponseDto(tableItem);
            res.status(201).json(this.classTransformer.classToPlain(apiResponse));
        })
        .catch((error: Error) => {
            if (error instanceof TableExistingError) {
                let apiResponse = new ApiResponseDto(
                    [],
                    [new ApiErrorItemResponse(ApiErrorItemResponse.VALIDATION_ERROR, "", [
                        new ValidationErrorItem("id", createTableDto.id, [error.message])
                    ])]
                );
                res.status(400).json(apiResponse);
            } else {
                this.handleInternalServerError(error, res);
            }
        })
        ;
    }

    // @todo implement authentication
    @httpDelete("/:id")
    deleteTable(
        @requestParam("id") tableId: string,
        @response() res: express.Response
    ): Promise<void> {
        return Promise.resolve<void>(this.tableService.deleteTable(tableId))
        .then(() => {
            let apiResponse = new ApiResponseDto(null);
            res.status(200).json(this.classTransformer.classToPlain(apiResponse));
        })
        .catch((error: Error) => {
            this.handleInternalServerError(error, res);
        })
        ;
    }

    // @todo implement authentication
    @httpPut("/:id", bodyParser.json(), UpdateTableRequestParamConverter())
    updateTable(
        @requestParam("id") tableId: string,
        @requestBody(UPDATE_TABLE) updateTableDto: UpdateTableRequestDto,
        @response() res: express.Response
    ): Promise<void> {
        return Promise.resolve<TableListItem>(this.tableService.updateTable(tableId, updateTableDto))
        .then((tableItem) => {
            let apiResponse = new ApiResponseDto(tableItem);
            res.status(200).json(this.classTransformer.classToPlain(apiResponse));
        })
        .catch((error: Error) => {
            if (error instanceof TableNonExistingError) {
                let apiResponse = new ApiResponseDto(
                    [],
                    [new ApiErrorItemResponse(ApiErrorItemResponse.RESOURCE_NOT_FOUND, error.message, [])]
                );
                res.status(404).json(apiResponse);
            } else {
                this.handleInternalServerError(error, res);
            }
        })
        ;
    }
}
