import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import * as path from 'path';
import * as fs from 'fs';
import { ModuleImportsException } from '../exceptions/module-imports-exception';

export class AppModuleImportsTest implements ITestCase {

    description: string;
    foldersNoImport: string[];
    constructor() {
        this.description = 'App Module must contain the core module and the first level modules and can not contain any shared module';
        this.foldersNoImport = ['shared'];
    }


    run(context: IContext): Promise<string> {
        const sourceFolder = path.join(context.getWorkspace(), 'src/app');
        const appModule = `${sourceFolder}/app.module.ts`;

        return new Promise((resolve, reject) => {
            fs.readdir(sourceFolder, (err, files) => {
                if (err) {
                    reject(new ModuleImportsException());
                } else {
                    const dirs = files.filter(file => fs.statSync(path.join(sourceFolder, file)).isDirectory());
                    const buffer = fs.readFileSync(appModule, 'utf-8');
                    let validate = true;
                    let index = 0;
                    while (validate && index < dirs.length) {
                        const dir = dirs[index];
                        const regExp = new RegExp('(\s)?import.*from \'\.\/' + dir + '\/.*', 'g');
                        const cont = (buffer.match(regExp) || []).length;
                        validate = this.foldersNoImport.includes(dir) ? cont === 0 : cont > 0;
                        if(validate) index += 1;
                    }
                    
                    if (validate) {
                        resolve();
                    } else if (this.foldersNoImport.includes(dirs[index])){
                        reject(new ModuleImportsException(`App module must not contain the module ${dirs[index]}`));
                    } else {
                        reject(new ModuleImportsException(`App module must contain the module ${dirs[index]}`));
                    }
                }
            });
        });
    }

}