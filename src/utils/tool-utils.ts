import * as fs from 'fs';

const regExpImporLinet = new RegExp('(\s)?import {.*} from \'.*\'(;)?', 'g');

export class ToolUtils {
    constructor() {}

    static getPackageJson(path: string): any {
        return require(path);
    }

    static getImports(path: string): string[] {
        const bufferModule = fs.readFileSync(path, 'utf-8');
        return bufferModule.match(regExpImporLinet) || [];
    }
}
