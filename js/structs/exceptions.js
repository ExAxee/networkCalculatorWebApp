/**
 * Raised when a certain value has overflown
 */
export class OverflowError extends Error {
    /**
     * Throws an OverflowError with the given message
     * @param {String} message The message to display
     */
    constructor (message = "") {
        super(message);
        this.name = "OverflowError"
    }
}
