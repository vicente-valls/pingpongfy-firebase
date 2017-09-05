import {provide} from "../../ioc/IoC";
import {Table} from "../domain/Table/Table";
import {TableId} from "../domain/Table/TableId";
import SYMBOLS from "../../ioc/Symbols";

@provide(SYMBOLS.TableFactory)
export class TableFactory {
    create(reference: string, description: string, isFree: boolean, updatedAt: Date) {
        return new Table(new TableId(reference), description, isFree, updatedAt);
    }
}
