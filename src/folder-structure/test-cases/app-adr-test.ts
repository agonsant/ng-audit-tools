import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import { AdrException } from '../exceptions/adr-exception';
import * as path from 'path';
import * as fs from 'fs';
export class AppAdrTest implements ITestCase {

    description: string;
    adrFolder: string;
    adrFileExt: string;
    constructor() {
        this.description = 'Should to exist ADR (Architecture decision record) folder and not be empty';
        this.adrFolder = 'adr';
        this.adrFileExt = '.md'
    }

    run(context: IContext): Promise<string> {
        const adrPath = path.join(context.getWorkspace(), this.adrFolder);
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(adrPath)) return reject(new AdrException(this.description, adrPath));
            
            fs.readdir(adrPath, (err, files) => {
                if (err) return reject(new AdrException());
                const validate = files.length > 0 && files.every(file => path.extname(file) === this.adrFileExt);
                if(!validate) return reject(new AdrException(this.description, adrPath)); 
                return resolve();
            });
        });
    }

}