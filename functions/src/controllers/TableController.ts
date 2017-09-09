import {
    TYPE, controller, httpGet, interfaces, response, httpPost, requestBody,
    httpDelete, requestParam, httpPut
} from "inversify-express-utils";
import {container, provideNamed} from "../../ioc/IoC";
import TAGS from "../../ioc/Tags";
import * as express from "express";
import {inject} from "inversify";
import {ApiResponseDto} from "../dto/ApiResponseDto";
import SYMBOLS from "../../ioc/Symbols";
import {TableListItem} from "../dto/TableListItem";
import {ClassTransformer} from "class-transformer";
import * as bodyParser from "body-parser";
import {CreateTableRequestDto} from "../dto/CreateTableRequestDto";
import {TableExistingError} from "../errors/TableExistingError";
import {ApiErrorItemResponse} from "../dto/ApiErrorItemResponse";
import {ValidationErrorItem} from "../errors/ValidationErrorItem";
import {BaseController} from "./BaseController";
import {UpdateTableRequestDto} from "../dto/UpdateTableRequestDto";
import {TableNonExistingError} from "../errors/TableNonExistingError";
import {ITableService} from "../services/ITableService";
import {ParamConverter} from "../param-converters/ParamConverter";
import {InvalidDtoError} from "../errors/InvalidDtoError";

@provideNamed(TYPE.Controller, TAGS.TableController)
@controller("/v1/tables")
export class TableController extends BaseController implements interfaces.Controller {
    static UPDATE_TABLE_PARAM_NAME = "updateTable";
    static CREATE_TABLE_PARAM_NAME = "createTable";

    constructor(
        @inject(SYMBOLS.TableService) private tableService: ITableService,
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
    @httpPost("/", bodyParser.json(), container.get<ParamConverter>(SYMBOLS.ParamConverter).convert(
            TableController.CREATE_TABLE_PARAM_NAME, CreateTableRequestDto
        )
    )
    createTable(
        @requestBody(TableController.CREATE_TABLE_PARAM_NAME) createTableDto: CreateTableRequestDto,
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
            } else if (error instanceof InvalidDtoError) {
                this.handleValidationErrors(error, res);
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
    @httpPut("/:id", bodyParser.json(),
        container.get<ParamConverter>(SYMBOLS.ParamConverter).convert(
            TableController.UPDATE_TABLE_PARAM_NAME, UpdateTableRequestDto
        )
    )
    updateTable(
        @requestParam("id") tableId: string,
        @requestBody(TableController.UPDATE_TABLE_PARAM_NAME) updateTableDto: UpdateTableRequestDto,
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
            } else if (error instanceof InvalidDtoError) {
                this.handleValidationErrors(error, res);
            } else {
                this.handleInternalServerError(error, res);
            }
        })
        ;
    }
}
