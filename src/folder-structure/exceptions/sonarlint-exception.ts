

export class SonarlintException extends Error {

    constructor(message: string = 'Generic Error', lintResult: string = 'Not found') {
        super(`SonarlintException: ${message}.\nResult lint: ${lintResult}`);
    }

}