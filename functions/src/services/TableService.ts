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
import {UpdateTableRequestDto} from "../dto/UpdateTableRequestDto";
import {TableNonExistingError} from "../errors/TableNonExistingError";

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
                    table.getId(),
                    table.getDescription(),
                    table.getIsFree(),
                    table.getUpdatedAt()
                );
            });
        });
    }

    createTable(createTableDto: CreateTableRequestDto): Promise<TableListItem> {
        return Promise.resolve(new TableId(createTableDto.id))
        .then((tableId) => this.tableRepository.getById(tableId))
        .then((tableFound) => {
            if (tableFound) {
                throw new TableExistingError("table already exists id: " + tableFound.getId());
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
                    table.getId(),
                    table.getDescription(),
                    table.getIsFree(),
                    table.getUpdatedAt()
                );
            })
        })
    }

    deleteTable(id: string): Promise<void> {
        return Promise.resolve(new TableId(id))
        .then((tableId) => this.tableRepository.getById(tableId))
        .then((table: Table|null) => {
            if (table) {
                return this.tableRepository.remove(table);
            }
        });
    }

    updateTable(id: string, updateTableRequestDto: UpdateTableRequestDto): Promise<TableListItem> {
        return Promise.resolve(new TableId(id))
        .then((tableId) => this.tableRepository.getById(tableId))
        .then((tableFound) => {
            if (!tableFound) {
                throw new TableNonExistingError("table does not exist id: " + id);
            }
            if (updateTableRequestDto.isFree) {
                tableFound.release();
            } else {
                tableFound.book();
            }
            return this.tableRepository.add(tableFound)
            .then(() => {
                return new TableListItem(
                    tableFound.getId(),
                    tableFound.getDescription(),
                    tableFound.getIsFree(),
                    tableFound.getUpdatedAt()
                );
            })
        })
    }
}
