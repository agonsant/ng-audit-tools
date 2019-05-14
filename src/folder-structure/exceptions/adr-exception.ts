

export class AdrException extends Error {

    constructor(message: string = 'Generic Error', folderPath: string = 'Not found') {
        super(`AdrException: ${message}. Folder path should be: ${folderPath}`);
    }

}