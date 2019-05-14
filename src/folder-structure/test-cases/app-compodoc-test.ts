import { ITestCase } from '../../types/i-test-case';
import { ToolUtils } from '../../utils/tool-utils';
import { IContext } from '../../types/i-context';
import { CompodocException } from '../exceptions/compodoc-exception';
import * as path from 'path';

export class AppCompodocTest implements ITestCase {

    description: string;
    compodocKey: string;
    constructor() {
        this.description = 'Compodoc should be to exist in te project';
        this.compodocKey = '@compodoc/compodoc';
    }

    run(context: IContext): Promise<string> {
        const sourceFolder = path.join(context.getWorkspace(), 'package.json');
        return new Promise((resolve, reject) => {
            const packageJson = ToolUtils.getPackageJson(sourceFolder);
            const compodoc = packageJson.dependencies[this.compodocKey]; 
            if (compodoc) {
                resolve();
            } else {
                reject(new CompodocException(this.description, compodoc));
            }
        });
    }

}