

export class ReadmeException extends Error {

    constructor(message: string = 'Generic Error', folderPath: string = 'Not found') {
        super(`ReadmeException: ${message}. Folder path: ${folderPath}`);
    }

}