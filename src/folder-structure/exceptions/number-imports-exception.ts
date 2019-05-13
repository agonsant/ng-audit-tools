export class NumberImportsException extends Error {

    constructor(message: string = 'Generic Error') {
        super(`NumberImportsException: ${message}`);
    }

}