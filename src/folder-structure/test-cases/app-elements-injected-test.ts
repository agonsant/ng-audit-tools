import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import {ToolUtils} from '../../utils/tool-utils';
import {ElementInjectedException} from '../exceptions/element-injected-exception';
import * as path from 'path';
let glob = require('glob');


export class AppElementsInjectedTest implements ITestCase {

    description: string;
    constructor() {
        this.description = 'Element has not been injected in any module';
    }

    getImportsPath(modulePath: string): string[] {
        const importsColl = ToolUtils.getImports(modulePath);
        return importsColl.map(importItem => {
            const split = importItem.split('from')[1];
            const splitReplace = split.replace(/(\'|;)/g, '');
            return splitReplace.trim();
        });
    }

    findImportFileInModule(filePath: string, modulePath: string): string | undefined {
        const importsPath = this.getImportsPath(modulePath);
        const filePathWithoutExt = filePath.replace(/\.ts/g, '');
        return importsPath.find(url => {
            const splitUrl = url.split('/').filter(element => element !== '.' && element !== '..');
            const joinUrl = splitUrl.join('/');
            return filePathWithoutExt.endsWith(joinUrl);
        });

    }

    run(context: IContext): Promise<string> {
        const sourceApp = path.join(context.getWorkspace(), 'src/app');
        
        return new Promise((resolve, reject) => {
            glob(`${sourceApp}/*/**/!(*.spec).ts`, (err: Error, filesPath: string[]) => {
                if (err) return reject(new ElementInjectedException());
               
                const modulesPath = glob.sync(`${sourceApp}/**/*.module.ts`);
                filesPath.forEach(filePath => {
                    let foundImport = false;
                    let index = 0;
                    while (!foundImport && index < modulesPath.length) {
                        foundImport = (this.findImportFileInModule(filePath, modulesPath[index]) || '').length > 0;
                        if(!foundImport) index += 1;
                    }
                    if (!foundImport) return reject(new ElementInjectedException(this.description, filePath));
                });
                
                return resolve();
            });
        });
    }

}