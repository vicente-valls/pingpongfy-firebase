import {TableId} from "./TableId";

export class Table {
    constructor(private id: TableId, private description: string, private isFree: boolean,
                private updatedAt: Date
    ) {

    }

    public getId(): TableId {
        return this.id;
    }

    public getDescription(): string {
        return this.description;
    }

    public getIsFree(): boolean {
        return this.isFree;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }
}
