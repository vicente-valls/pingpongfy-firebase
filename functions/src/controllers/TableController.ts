import {TYPE, controller, httpGet, interfaces, response} from "inversify-express-utils";
import {provideNamed} from "../../ioc/IoC";
import TAGS from "../../ioc/Tags";
import * as express from "express";
import {TableService} from "../services/TableService";
import {inject} from "inversify";
import {ApiResponseDto} from "../dto/ApiResponseDto";
import SYMBOLS from "../../ioc/Symbols";
import {TableListItem} from "../dto/TableListItem";
import {ClassTransformer} from "class-transformer";

@provideNamed(TYPE.Controller, TAGS.TableController)
@controller("/v1/tables")
export class TableController implements interfaces.Controller {
    constructor(
        @inject(SYMBOLS.TableService) private tableService: TableService,
        @inject(SYMBOLS.ClassTransformer) private classTransformer: ClassTransformer
    ) {
    }

    @httpGet("/")
    getTables(@response() res: express.Response): Promise<void> {
        // @todo implement proper error handling
        return Promise.resolve<TableListItem[]>(this.tableService.getTables())
        .then((tableItems) => {
            let apiResponse = new ApiResponseDto(tableItems);
            res.json(this.classTransformer.classToPlain(apiResponse));
        });
    }
}
