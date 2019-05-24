

export class TslintSonarException extends Error {

    constructor(message: string = 'Generic Error', lintResult: string = 'Not found') {
        super(`TslintSonarException: ${message}.\nResult lint: ${lintResult}.`);
    }

}