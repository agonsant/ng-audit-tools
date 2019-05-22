

export class StructureModuleException extends Error {

    constructor(message: string = 'Generic Error', pathModule: string = 'Not found') {
        super(`StructureModuleException: ${message}.\nModule found is: ${pathModule}`);
    }

}