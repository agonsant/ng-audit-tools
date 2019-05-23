import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import {NumberImportsException} from '../exceptions/number-imports-exception';

let glob = require('glob');
import * as path from 'path';
import * as fs from 'fs';


export class AppNumberImportsTest implements ITestCase {

    description: string;
    limit: number;
    constructor() {
        this.limit = 50;
        this.description = `There can not be more than ${this.limit} elements injected in a module`;
    }

    run(context: IContext): Promise<string> {
        return new Promise((resolve, reject) => {
            const sourceAppPath = path.join(context.getWorkspace(), 'src/app');
            glob(`${sourceAppPath}/**/*.module.ts`, (err: Error, filesPath: string[]) => {
                if (err) return reject(new NumberImportsException());

                let validate = filesPath.length > 0;
                let index = 0;
                let importCounter = 0;
                while(validate && index < filesPath.length) {
                    const buffer = fs.readFileSync(filesPath[index], 'utf-8');
                    importCounter = (buffer.match(/import/g) || []).length;
                    if (validate = importCounter <= this.limit) {
                        index += 1;
                        importCounter = 0;
                    }
                }
                if(!validate) return reject(new NumberImportsException(this.description, filesPath[index], importCounter));
                return resolve(); 
            });
        });
    }

}