import {TableId} from "./TableId";

export class Table {
    constructor(private id: TableId, private description: string, private isFree: boolean,
                private updatedAt: Date
    ) {

    }

    public getId(): string {
        return this.id.id;
    }

    public getDescription(): string {
        return this.description;
    }

    public getIsFree(): boolean {
        return this.isFree;
    }

    public book(): void {
        this.isFree = false;
        this.updatedAt = new Date();
    }

    public release(): void {
        this.isFree = true;
        this.updatedAt = new Date();
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }
}
