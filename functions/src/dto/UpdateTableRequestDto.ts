import {IsBoolean} from "class-validator";

export class UpdateTableRequestDto {
    @IsBoolean()
    public readonly isFree: boolean;
    constructor(isFree: boolean) {
        this.isFree = isFree;
    }
}
