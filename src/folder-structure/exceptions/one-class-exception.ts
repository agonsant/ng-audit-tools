export class OneClassException extends Error {

    constructor(message: string = 'Generic Error', filePath: string = 'Not found', numberClasses: number = 0) {
        super(`OneClassException: ${message}. File: ${filePath}. Number clases: ${numberClasses}`);
    }

}