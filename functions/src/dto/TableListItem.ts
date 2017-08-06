import {IDto} from "./IDto";

export class TableListItem implements IDto {
    readonly id: string;
    readonly description: string;
    readonly isFree: boolean;
    readonly updatedAt: Date;
    constructor(id: string, description: string, isFree: boolean, updatedAt: Date) {
        this.id = id;
        this.description = description;
        this.isFree = isFree;
        this.updatedAt = updatedAt;
    }
}
