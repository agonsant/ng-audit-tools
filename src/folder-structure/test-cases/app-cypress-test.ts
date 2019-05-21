import { ITestCase } from '../../types/i-test-case';
import { ToolUtils } from '../../utils/tool-utils';
import { IContext } from '../../types/i-context';
import { CypressException } from '../exceptions/cypress-exception';
import * as path from 'path';

export class AppCypressTest implements ITestCase {

    description: string;
    cypressKey: string;
    constructor() {
        this.description = 'Cypress should be to exist in te project';
        this.cypressKey = 'cypress';
    }

    run(context: IContext): Promise<string> {
        const workSpace = context.getWorkspace();
        const sourceFolder = path.join(workSpace, 'package.json');
        return new Promise((resolve, reject) => {
            const packageJson = ToolUtils.getPackageJson(sourceFolder);
            const cypress = packageJson.devDependencies[this.cypressKey]; 
            if (cypress) {
               resolve();
            } else {
                reject(new CypressException(this.description, cypress));
            }
        });
    }

}