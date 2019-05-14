

export class CypressException extends Error {

    constructor(message: string = 'Generic Error', cypressVersion: string = 'Not found') {
        super(`CypressException: ${message}. The cypress version founded is: ${cypressVersion}`);
    }

}