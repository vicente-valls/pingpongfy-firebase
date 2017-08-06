import {provide} from "../../ioc/IoC";
import SYMBOLS from "../../ioc/Symbols";
import {ITableRepository} from "../domain/Table/ITableRepository";
import {inject} from "inversify";
import {Table} from "../domain/Table/Table";
import {TableListItem} from "../dto/TableListItem";
import * as Promise from "bluebird";

@provide(SYMBOLS.TableService)
export class TableService {
    constructor(@inject(SYMBOLS.TableRepository) private tableRepository: ITableRepository) {
    }

    getTables(): Promise<TableListItem[]> {
        return this.tableRepository
        .get()
        .then((tables: Table[]) => {
            return tables.map((table) => {
                return new TableListItem(
                    table.getId().id,
                    table.getDescription(),
                    table.getIsFree(),
                    table.getUpdatedAt()
                );
            });
        });
    }
}
