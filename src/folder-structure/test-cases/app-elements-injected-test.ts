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

    getPathImport(importItem: string): string {
        const split = importItem.split('from')[1];
        const splitReplace = split.replace(/(\'|;)/g, '');
        return splitReplace.trim();
    }

    getPathImportsModule(modulePath: string): string[] {
        const importsColl = ToolUtils.getImports(modulePath);
        return importsColl.map(importItem => this.getPathImport(importItem));
    }

    foundImportFileInModule(file: string, modulePath: string): any {
        const pathImports = this.getPathImportsModule(modulePath);
        const fileWithoutExt = file.replace(/\.ts/g, '');
        return pathImports.find(url => {
            const splitUrl = url.split('/').filter(element => element !== '.' && element !== '..');
            const joinUrl = splitUrl.join('/');
            return fileWithoutExt.indexOf(joinUrl) > -1;
        });

    }

    run(context: IContext): Promise<string> {
        const sourceApp = path.join(context.getWorkspace(), 'src/app');
        
        return new Promise(resolve => {
            glob(`${sourceApp}/*/**/!(*.spec).ts`, (err: any, files: any) => {
                if (err) {
                    throw new ElementInjectedException();
                } else {
                    const modules = glob.sync(`${sourceApp}/**/*.module.ts`);
                    files.forEach((file: string) => {
                        let foundImport: any = false;
                        let index = 0;
                        while (!foundImport && index < modules.length) {
                            foundImport = this.foundImportFileInModule(file, modules[index]);
                            if(!foundImport) index += 1;
                        }
                        if (!foundImport) {
                            throw new ElementInjectedException(this.description, file);
                        }
                    });
                }
                resolve();
            });
        });
    }

}