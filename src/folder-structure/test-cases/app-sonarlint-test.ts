import { ITestCase } from '../../types/i-test-case';
import { ToolUtils } from '../../utils/tool-utils';
import { IContext } from '../../types/i-context';
import * as path from 'path';
import * as child_process from 'child_process';
import { SonarlintException } from '../exceptions/sonarlint-exception';


export class AppSonarlintTest implements ITestCase {

    description: string;
    sonarlintKeyDep: string;
    lintCommand: string;
    constructor() {
        this.description = 'SonarLint should be to exist in te project and pass tests';
        this.sonarlintKeyDep = 'sonarlint';
        this.lintCommand = 'ng lint';
    }

    run(context: IContext): Promise<string> {
        const workSpace = context.getWorkspace();
        return new Promise((resolve, reject) => {
            const packageJson = ToolUtils.getPackageJson(path.join(workSpace, 'package.json'));
            const sonarlint = packageJson.dependencies[this.sonarlintKeyDep];
            if (sonarlint) {
                child_process.exec(this.lintCommand, {cwd: workSpace}, (err, stdout, stderr) => {
                    if (err) reject(new SonarlintException(this.description, stdout ? stdout : stderr));
                    resolve();
                });
            } else {
                reject(new SonarlintException(this.description));
            }
        });
    }

}