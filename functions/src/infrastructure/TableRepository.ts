import {ITableRepository} from "../domain/Table/ITableRepository";
import {Table} from "../domain/Table/Table";
import SYMBOLS from "../../ioc/Symbols";
import {provide} from "../../ioc/IoC";
import * as Promise from "bluebird";
import {TableId} from "../domain/Table/TableId";
import {inject} from "inversify";
import {FirebaseAppConnection} from "./FirebaseConnection";
import {TableFactory} from "../services/TableFactory";

@provide(SYMBOLS.TableRepository)
export class TableRepository implements ITableRepository {
    static NODE = "tables";
    constructor(
        @inject(SYMBOLS.FirebaseAppConnection) private firebaseApp: FirebaseAppConnection,
        @inject(SYMBOLS.TableFactory) private tableFactory: TableFactory
    ) {
    }

    add(table: Table): Promise<void> {
        return Promise.resolve();
    }

    remove(table: Table): Promise<void> {
        return Promise.resolve();
    }

    get(): Promise<Table[]> {
        return Promise.resolve<any>(this.firebaseApp.getDatabase().ref(TableRepository.NODE).once("value"))
        .then((dataSnapshot: any) => {
            let tables: Table[] = [];
            if (dataSnapshot.val()) {
                dataSnapshot.forEach((childSnapshot: any) => {
                    let childData = childSnapshot.val();
                    tables.push(
                        this.tableFactory.create(
                            childSnapshot.key,
                            childData.description,
                            childData.isFree, new Date(childData.updatedAt)
                        )
                    );
                });
            }

            return tables;
        });
    }

    getById(tableId: TableId): Promise<Table|null> {
        return Promise.resolve(null);
    }
}
