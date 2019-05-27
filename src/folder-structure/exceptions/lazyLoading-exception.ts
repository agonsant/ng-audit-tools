

export class LazyLoadingException extends Error {

    constructor(message: string = 'Generic Error', routerModule: string = 'Not found') {
        super(`LazyLoadingException: ${message}. Router module error: ${routerModule}`);
    }

}