import {IsAlphanumeric, Length} from "class-validator";

export class CreateTableRequestDto {
    @Length(5, 20)
    @IsAlphanumeric()
    public readonly id: string;
    public readonly description: string;
    constructor(id: string, description: string) {
        this.id = id;
        this.description = description;
    }
}
