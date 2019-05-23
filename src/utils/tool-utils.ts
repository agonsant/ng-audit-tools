import * as fs from 'fs';

const regExpImporLine = new RegExp('(\s)?import {.*} from \'.*\'(;)?', 'g');
const regExpLazyLoading = new RegExp('RouterModule\.forChild\(.+\)', 'g');
const regExprModulesPath = new RegExp('.*/modules/[^/]+$', 'g');

export class ToolUtils {
    constructor() {}

    static getPackageJson(path: string): any {
        return require(path);
    }

    static getImports(path: string): string[] {
        try {
            const bufferModule = fs.readFileSync(path, 'utf-8');
            return bufferModule.match(regExpImporLine) || [];
        } catch(err) {
            return [];
        }
    }

    static hasLazyLoading(path: string): boolean {
        try {
            const buffer = fs.readFileSync(path, 'utf-8');
            return (buffer.match(regExpLazyLoading) || []).length === 1;
        } catch(err) {
            return false;
        }
    }

    static isModuleDirectoryPath(moduleDirectoryPath: string): boolean {
        return regExprModulesPath.test(moduleDirectoryPath) && fs.statSync(moduleDirectoryPath).isDirectory();
    }
}
