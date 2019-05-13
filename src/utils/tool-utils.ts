import * as fs from 'fs';

export class ToolUtils {
    constructor() {}

    static getPackageJson(path: string): any {
        try {
            const file = fs.readFileSync(path, 'utf-8');
            return JSON.parse(file);
        } catch (err) {
            throw err;
        }
    }
}
