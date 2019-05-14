import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
let glob = require('glob');
import * as path from 'path';
import * as fs from 'fs';

import {NumberImportsException} from '../exceptions/number-imports-exception';

export class AppNumberImportsTest implements ITestCase {

    description: string;
    limit: number;
    constructor() {
        this.limit = 50;
        this.description = `There can not be more than ${this.limit} elements injected in a module`;
    }

    exceedsLimitOfImports(file: string): boolean {
        const buffer = fs.readFileSync(file, 'utf-8');
        const count = (buffer.match(/import/g) || []).length;
        return count <= this.limit;
    }

    run(context: IContext): Promise<string> {
        return new Promise((resolve, reject) => {
            const sourceFolder = path.join(context.getWorkspace(), 'src/app');
            const src = `${sourceFolder}/**/*.module.ts`;
            let validate = true;
            glob(src, (err: any, files: any) => {
                if (err) {
                   reject(new NumberImportsException());
                } else {
                    let i = 0;
                    while(validate && i < files.length) {
                        validate = this.exceedsLimitOfImports(files[i]);
                        if (validate) i += 1;
                    }
                    if (validate) {
                        resolve();
                    } else {
                        reject(new NumberImportsException(`The module ${files[i]} has more than ${this.limit} imports`));
                    }
                }
                
            });
        });
    }

}