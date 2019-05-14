

export class CompodocException extends Error {

    constructor(message: string = 'Generic Error', compodocVersion: string = 'Not found') {
        super(`CompodocException: ${message}. The founded compodoc version is: ${compodocVersion}`);
    }

}