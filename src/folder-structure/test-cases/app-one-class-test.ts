import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import * as fs from 'fs';
import * as path from 'path';
let glob = require('glob');
import {OneClassException} from '../exceptions/one-class-exception';

export class AppOneClassTest implements ITestCase {

    description: string;
    limitClassPerFile: number;
    constructor() {
        this.description = 'A file can not have more than one TypeScript class';
        this.limitClassPerFile = 1;
    }

    hasOneClassAsMax(file: string) {
        const f = fs.readFileSync(file, 'utf-8');
        const count = (f.match(/class/g) || []).length;
        return count <= this.limitClassPerFile;
    }

    run(context: IContext): Promise<string> {
        return new Promise((resolve, reject) => {
            const sourceFolder = path.join(context.getWorkspace(), 'src/app');
            const src = `${sourceFolder}/**/*.ts`;
            let validate = true; 
            glob(src, (err: any, files: any) => {
                if (err) {
                    reject(new OneClassException());
                } else {
                    let i = 0;
                    while(validate && i < files.length) {
                        validate = this.hasOneClassAsMax(files[i]);
                        if (validate) i += 1;
                    }
        
                    if(validate) {
                        resolve();
                    } else {
                        reject(new OneClassException(`The file ${files[i]} has more than ${this.limitClassPerFile} class/es`));
                    }
                }
            });

        });
    }

}