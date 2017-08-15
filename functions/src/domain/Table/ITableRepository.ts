import {Table} from "./Table";
import * as Promise from "bluebird";
import {TableId} from "./TableId";

export interface ITableRepository {
    add(table: Table): Promise<void>;
    remove(table: Table): Promise<void>;
    get(): Promise<Table[]>;
    getById(tableId: TableId): Promise<Table|null>;
}
