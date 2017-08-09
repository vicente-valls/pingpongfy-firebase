import {provide} from "../../ioc/IoC";
import SYMBOLS from "../../ioc/Symbols";
import {ITableRepository} from "../domain/Table/ITableRepository";
import {inject} from "inversify";
import {Table} from "../domain/Table/Table";
import {TableListItem} from "../dto/TableListItem";
import * as Promise from "bluebird";
import {CreateTableRequestDto} from "../dto/CreateTableRequestDto";
import {TableId} from "../domain/Table/TableId";
import {TableExistingError} from "../errors/TableExistingError";
import {TableFactory} from "./TableFactory";

@provide(SYMBOLS.TableService)
export class TableService {
    constructor(
        @inject(SYMBOLS.TableRepository) private tableRepository: ITableRepository,
        @inject(SYMBOLS.TableFactory) private tableFactory: TableFactory
    ) {
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

    createTable(createTableDto: CreateTableRequestDto): Promise<TableListItem> {
        let tableId = new TableId(createTableDto.id);
        return this.tableRepository
        .getById(tableId)
        .then((tableFound) => {
            if (tableFound) {
                throw new TableExistingError("table already exists id: " + tableId.id);
            }
            let table = this.tableFactory.create(
                createTableDto.id,
                createTableDto.description,
                true,
                new Date()
            );
            return this.tableRepository.add(table)
            .then(() => {
                return new TableListItem(
                    table.getId().id,
                    table.getDescription(),
                    table.getIsFree(),
                    table.getUpdatedAt()
                );
            })
        })
    }
}
