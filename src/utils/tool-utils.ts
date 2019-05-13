export class ToolUtils {
    constructor() {}

    static getPackageJson(path: string): any {
        return require(path);
    }
}
