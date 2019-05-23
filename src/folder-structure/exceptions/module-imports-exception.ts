export class ModuleImportsException extends Error {

    constructor(message: string = 'Generic Error', errorCause: string = 'Not found') {
        super(`ModuleImportsException: ${message}. Error cause: ${errorCause}.`);
    }

}