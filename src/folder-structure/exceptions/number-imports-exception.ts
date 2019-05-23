export class NumberImportsException extends Error {

    constructor(message: string = 'Generic Error', modulePath:string = 'Not found', numberImports: number = 0) {
        super(`NumberImportsException: ${message}. Module: ${modulePath}. Numbers of elements imported: ${numberImports}.`);
    }

}