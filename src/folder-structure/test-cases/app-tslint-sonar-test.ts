import { ITestCase } from '../../types/i-test-case';
import { ToolUtils } from '../../utils/tool-utils';
import { IContext } from '../../types/i-context';
import { TslintSonarException } from '../exceptions/tslint-sonar-exception';
import * as path from 'path';
import * as child_process from 'child_process';


export class AppTslintSonarTest implements ITestCase {

    description: string;
    tslintSonartKeyDep: string;
    lintCommand: string;
    constructor() {
        this.description = 'Tslint-sonart should be to exist in te project like tslint extension and pass all lint test';
        this.tslintSonartKeyDep = 'tslint-sonarts';
        this.lintCommand = 'npm run lint';
    }

    run(context: IContext): Promise<string> {
        const workSpace = context.getWorkspace();
        return new Promise((resolve, reject) => {
            const packageJson = ToolUtils.getPackageJson(path.join(workSpace, 'package.json'));
            const tslintSonart = packageJson.dependencies[this.tslintSonartKeyDep];

            const tsConfigJson = ToolUtils.getPackageJson(path.join(workSpace, 'tslint.json'));
            const tsConfigExtends = tsConfigJson.extends;

            if(tslintSonart && tsConfigExtends.includes(this.tslintSonartKeyDep)) {
                try {
                    child_process.execSync(this.lintCommand, {cwd: workSpace, stdio: 'pipe'});
                    return resolve();
                } catch(err) {
                    const commandLintError = err.stdout ? err.stdout : err.stderr;
                    return reject(new TslintSonarException(this.description, commandLintError));
                }
            }

            return reject(new TslintSonarException(this.description));
        });
    }

}