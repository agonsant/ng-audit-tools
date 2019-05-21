import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import { ReadmeException } from '../exceptions/readme-exception';

import * as path from 'path';
import * as fs from 'fs';

let glob = require('glob');
export class AppReadmeTest implements ITestCase {

    description: string;
  
    constructor() {
        this.description = 'Should to exist Readme.md file by module';
    }

    run(context: IContext): Promise<string> {
        const sourceFolder = path.join(context.getWorkspace(), '/src/app');
        return new Promise((resolve, reject) => {
            glob(`${sourceFolder}/**/modules/*/**`, (err: any, files: any) => {

                const dirs = files.filter((file: string) => fs.statSync(file).isDirectory() && !file.endsWith('modules'));
                if(err) reject(new ReadmeException());
                let index = 0;
                let validate = dirs.length > 0;
                while (validate && index < dirs.length) {
                    const filesDir = fs.readdirSync(dirs[index], 'utf-8');
                    if(validate = (filesDir.find(file => file === 'Readme.md') || '').length > 0) index += 1;
                };

                validate ? resolve() : reject(new ReadmeException(this.description, dirs[index]));
            });
        });
    }

}