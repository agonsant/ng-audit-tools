import * as fs from 'fs';

const regExpImporLine = new RegExp('(\s)?import {.*} from \'.*\'(;)?', 'g');
const regExpLazyLoadingChild = new RegExp('RouterModule\.forChild\(.+\)', 'g');
const regExpLazyLoadingRoot = new RegExp('RouterModule\.forRoot\(.+\)', 'g');
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
            return path.endsWith('app-routing.module.ts') ? (buffer.match(regExpLazyLoadingRoot) || []).length === 1 : (buffer.match(regExpLazyLoadingChild) || []).length === 1;
        } catch(err) {
            return false;
        }
    }

    static isModuleDirectoryPath(moduleDirectoryPath: string): boolean {
        return regExprModulesPath.test(moduleDirectoryPath) && fs.statSync(moduleDirectoryPath).isDirectory();
    }
}
