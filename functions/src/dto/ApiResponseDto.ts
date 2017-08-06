import {IDto} from "./IDto";
import {ApiErrorItemResponse} from "./ApiErrorItemResponse";

export class ApiResponseDto {
    readonly data: IDto|IDto[];
    readonly errors: ApiErrorItemResponse[];

    constructor(data: IDto, errors: ApiErrorItemResponse[] = []) {
        this.data = data;
        this.errors = errors;
    }
}
