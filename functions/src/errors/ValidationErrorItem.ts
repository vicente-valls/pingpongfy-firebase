export class ValidationErrorItem {
    /**
     * Object's property that haven't pass validation.
     */
    public readonly property: string;
    /**
     * Value that haven't pass a validation.
     */
    public readonly value: any;

    /**
     * Constraints that failed validation with error messages.
     */
    public readonly constraints: {
        [type: string]: string;
    };

    constructor(property: string, value: string, constraints: any) {
        this.property = property;
        this.value = value;
        this.constraints = constraints;
    }
}
