

export class AngularVersionException extends Error {

    constructor(message: string = 'Generic Error', angularVersion: string = 'Not found') {
        super(`AngularVersionException: ${message}. The angular version founded is: ${angularVersion}`);
    }

}