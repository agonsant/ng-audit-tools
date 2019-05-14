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
        const sourceFolder = path.join(context.getWorkspace(), this.adrFolder);
        return new Promise(resolve => {
            const existAdrFolder = fs.existsSync(sourceFolder);
            if (!existAdrFolder) throw new AdrException(this.description, sourceFolder);
            fs.readdir(sourceFolder, (err, files) => {
                if (err) throw new AdrException();
                const validate = files.length > 0 && files.every(file => path.extname(file) === this.adrFileExt);
                if(!validate) throw new AdrException(this.description, sourceFolder); 
                resolve();
            });
        });
    }

}