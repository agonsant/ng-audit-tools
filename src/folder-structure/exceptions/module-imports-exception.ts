export class ModuleImportsException extends Error {

    constructor(message: string = 'Generic Error') {
        super(`ModuleImportsException: ${message}`);
    }

}