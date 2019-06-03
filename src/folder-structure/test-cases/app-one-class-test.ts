import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import {OneClassException} from '../exceptions/one-class-exception';

import * as fs from 'fs';
import * as path from 'path';
let glob = require('glob');

export class AppOneClassTest implements ITestCase {

    description: string;
    limit: number;
    constructor() {
        this.limit = 1;
        this.description = `A file can not have more than ${this.limit} TypeScript class`;
    }

    run(context: IContext): Promise<string> {
        return new Promise((resolve, reject) => {
            const sourceAppPath = path.join(context.getWorkspace(), 'src/app');
            let validate = true; 
            glob(`${sourceAppPath}/**/*.ts`, (err: Error, files: string[]) => {
                if (err) return reject(new OneClassException());
                
                let index = 0;
                let classCounter = 0;
                while(validate && index < files.length) {
                    const buffer = fs.readFileSync(files[index], 'utf-8');
                    classCounter = (buffer.match(/(export )?class \w+ (implements \w+ )?\{/g) || []).length;
                    if (validate = classCounter <= this.limit) {
                        index += 1;
                        classCounter = 0;  
                    } 
                }
    
                if(!validate) return reject(new OneClassException(this.description, files[index], classCounter));
                return resolve();
            });

        });
    }

}