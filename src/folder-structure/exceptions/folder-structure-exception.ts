

export class FolderStructureException extends Error {

    constructor(message: string = 'Generic Error', foundedFolderStructure: string = 'Not found') {
        super(`FolderStructureException: ${message}. The founded folder structure is: ${foundedFolderStructure}`);
    }

}