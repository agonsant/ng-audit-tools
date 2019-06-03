

export class ElementInjectedException extends Error {

    constructor(message: string = 'Generic Error', file: string = 'Not found') {
        super(`ElementInjectedException: ${message}. The angular element is: ${file}`);
    }

}