import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import { ReadmeException } from '../exceptions/readme-exception';
import {ToolUtils} from '../../utils/tool-utils';

import * as path from 'path';
import * as fs from 'fs';

let glob = require('glob');
export class AppReadmeTest implements ITestCase {

    description: string;
  
    constructor() {
        this.description = 'Should to exist Readme.md file by feature module and not be empty';
    }

    run(context: IContext): Promise<string> {
        const sourceAppPath = path.join(context.getWorkspace(), '/src/app');
        return new Promise((resolve, reject) => {
            glob(`${sourceAppPath}/modules/**`, (err: Error, filesPath: string[]) => {

                if(err) reject(new ReadmeException());
                const dirs = filesPath.filter((filePath: string) => ToolUtils.isModuleDirectoryPath(filePath));
                let index = 0;
                let validate = true;
                while (validate && index < dirs.length) {
                    const readmePath = path.join(dirs[index], 'Readme.md');
                    const readmeFileExist = fs.existsSync(readmePath);
                    const readmeFileIsEmpty = fs.readFileSync(readmePath, 'utf-8').length === 0;
                    
                    if(validate = (readmeFileExist && !readmeFileIsEmpty)) index += 1;
                };

                validate ? resolve() : reject(new ReadmeException(this.description, dirs[index]));
            });
        });
    }

}