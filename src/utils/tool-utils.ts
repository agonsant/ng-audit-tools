import * as fs from 'fs';

const regExpImporLine = new RegExp('(\s)?import {.*} from \'.*\'(;)?', 'g');
const regExpLazyLoading = new RegExp('RouterModule\.forChild\(.+\)', 'g');

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

    static hasLazyLoading(path: string) {
        try {
            const buffer = fs.readFileSync(path, 'utf-8');
            const matchsCount = (buffer.match(regExpLazyLoading) || []).length;
            return matchsCount === 1;
        } catch(err) {
            return false;
        }
    }
}
