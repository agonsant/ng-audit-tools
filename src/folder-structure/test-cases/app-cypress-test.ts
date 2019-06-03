import { ITestCase } from '../../types/i-test-case';
import { ToolUtils } from '../../utils/tool-utils';
import { IContext } from '../../types/i-context';
import { CypressException } from '../exceptions/cypress-exception';

import * as path from 'path';
import * as child_process from 'child_process';
const find_process = require('find-process');

export class AppCypressTest implements ITestCase {

    description: string;
    cypressKey: string;
    constructor() {
        this.description = 'Cypress should be to exist in te project and pass tests';
        this.cypressKey = 'cypress';
    }

    run(context: IContext): Promise<string> {
        const workSpace = context.getWorkspace();
        const sourceFolder = path.join(workSpace, 'package.json');
        return new Promise((resolve, reject) => {
            const packageJson = ToolUtils.getPackageJson(sourceFolder);
            const cypress = packageJson.dependencies[this.cypressKey]; 
            if (cypress) {
                const start = child_process.exec('npm run start', {cwd: workSpace});
                start.on('exit', () => {
                    find_process('port', 4200)
                        .then((foundProcess: any) => {
                            foundProcess.forEach((proc: any) => process.kill(proc.pid));
                            process.exit(0);
                        });
                });
                start.on('error', err => {
                    start.kill();
                    return reject(new CypressException(this.description, cypress, err.message));
                });

                start.stderr!.on('data', data => {
                    start.kill();
                    return reject(new CypressException(this.description, cypress, data));
                });
                start.stdout!.on('data', data => {
                    console.log(data);
                    if(data.includes('Compiled successfully.')) {
                        try {
                            const cypressRun = child_process.execSync('npm run cypress', {cwd: workSpace, stdio: 'pipe'});
                            start.kill();
                            console.log(cypressRun.toString());
                            return resolve();
                        } catch(errCypress) {
                            const commandCypressError = errCypress.stdout ? errCypress.stdout : errCypress.stderr;
                            start.kill();
                            return reject(new CypressException(this.description, cypress, commandCypressError));
                        }
                    }
                });
                
            } else {
                return reject(new CypressException(this.description));
            }
        });
    }

}