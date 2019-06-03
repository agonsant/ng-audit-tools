

export class CypressException extends Error {

    constructor(message: string = 'Generic Error', cypressVersion: string = 'Not found', resultCommand: string = 'Command not executed') {
        super(`CypressException: ${message}. The cypress version founded is: ${cypressVersion}. Command result: ${resultCommand}`);
    }

}