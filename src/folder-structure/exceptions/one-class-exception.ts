export class OneClassException extends Error {

    constructor(message: string = 'Generic Error') {
        super(`OneClassException: ${message}`);
    }

}