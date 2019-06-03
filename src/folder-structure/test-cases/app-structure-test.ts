import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import * as fs from 'fs';
import * as path from 'path';
import { FolderStructureException } from '../exceptions/folder-structure-exception';

export class AppStructureTest implements ITestCase {

    description: string;
    folders: string[];
    constructor() {
        this.description = 'The app folder should only have: core, shared and modules folders';
        this.folders = ['core', 'shared', 'modules'];
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
                const dirs = files.filter(file => fs.statSync(path.join(directoryPath, file)).isDirectory());
                if (dirs.length === this.folders.length && dirs.every(dir => this.folders.includes(dir))) {
                    resolve();
                } else {
                    reject(new FolderStructureException(this.description, files.join('\n')));
                }
            });
        });
    }

}