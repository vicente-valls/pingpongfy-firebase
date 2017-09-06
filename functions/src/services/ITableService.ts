import {TableListItem} from "../dto/TableListItem";
import {UpdateTableRequestDto} from "../dto/UpdateTableRequestDto";
import {CreateTableRequestDto} from "../dto/CreateTableRequestDto";
import * as Promise from "bluebird";

export interface ITableService {
    getTables(): Promise<TableListItem[]>;
    createTable(createTableDto: CreateTableRequestDto): Promise<TableListItem>;
    deleteTable(id: string): Promise<void>;
    updateTable(id: string, updateTableRequestDto: UpdateTableRequestDto): Promise<TableListItem>;
}
