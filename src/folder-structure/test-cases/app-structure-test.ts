import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import * as fs from 'fs';
import * as path from 'path';
import { FolderStructureException } from '../exceptions/folder-structure-exception';

export class AppStructureTest implements ITestCase {

    description: string;

    constructor() {
        this.description = 'The app folder should only have: core, shared and modules folders';
    }

    run(context: IContext): Promise<string> {
        return new Promise((resolve, reject) => {
            const directoryPath = path.join(context.getWorkspace(), 'src', 'app');
            try {
                fs.statSync(directoryPath).isDirectory();
            } catch (err) {
                throw new FolderStructureException(`The folder ${directoryPath} does not exists`);
            }
            fs.readdir(directoryPath, (err, files) => {
                if (err) throw new FolderStructureException(err.message, files ? files.join(' ') : '');
                if (files.length === 3 && files.includes('core') &&
                    files.includes('shared') && files.includes('modules')) {
                    resolve();
                } else {
                    reject(new FolderStructureException(this.description, files.join(' ')));
                }
            });
        });
    }

}