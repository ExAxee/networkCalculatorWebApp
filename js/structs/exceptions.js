export class OverflowError extends Error {
    constructor (message = "") {
        super(message);
        this.name = "OverflowError"
    }
}
