import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import * as path from 'path';
import * as fs from 'fs';
import { ModuleImportsException } from '../exceptions/module-imports-exception';

export class AppModuleImportsTest implements ITestCase {

    description: string;
    modulesNameToNotImport: string[];
    modulesNameToImport: string[];
    constructor() {
        this.description = 'App Module must contain the core module and the first level modules and can not contain any shared module';
        this.modulesNameToNotImport = ['shared'];
        this.modulesNameToImport = ['core'];
    }


    run(context: IContext): Promise<string> {
        const sourceAppPath = path.join(context.getWorkspace(), 'src/app');
        const appModulePath = path.join(sourceAppPath, 'app.module.ts');

        return new Promise((resolve, reject) => {
            fs.readdir(sourceAppPath, (err, files) => {
                if (err) return reject(new ModuleImportsException());
                
                const dirs = files.filter(file => fs.statSync(path.join(sourceAppPath, file)).isDirectory());
                const moduleNameNotFound = this.modulesNameToImport.find(moduleName => !dirs.includes(moduleName));
                if(moduleNameNotFound){
                    return reject(new ModuleImportsException(this.description, `Module ${moduleNameNotFound} should be exist in ${sourceAppPath}`));
                }
                const buffer = fs.readFileSync(appModulePath, 'utf-8');
                let validate = dirs.length > 0;
                let index = 0;
                while (validate && index < dirs.length) {
                    const dir = dirs[index];
                    const regExp = new RegExp('(\s)?import.*from \'\.\/' + dir + '\/.*', 'g');
                    const cont = (buffer.match(regExp) || []).length;
                    validate = this.modulesNameToNotImport.includes(dir) ? cont === 0 : cont > 0;
                    if(validate) index += 1;
                }

                if(validate) return resolve();

                if (this.modulesNameToNotImport.includes(dirs[index])){
                    return reject(new ModuleImportsException(this.description, `App module should not contain the module ${dirs[index]}`));
                }
                return reject(new ModuleImportsException(this.description, `App module should contain the module ${dirs[index]}`));
            });
        });
    }

}