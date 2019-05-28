import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import {ToolUtils} from '../../utils/tool-utils';
import { StructureModuleException } from '../exceptions/structure-module-exception';

import * as path from 'path';
import * as fs from 'fs';
let glob = require('glob');

export class AppStructurModule implements ITestCase {

    description: string;
    folders: string[];
    files: string[];

    constructor() {
        this.description = `Module structure must meet the following cases:
                            1) Must have a components folder with 4 files (.html, .ts, .spec.ts, .css | .scss)
                            2) Must have a [NameModule]-routing.module.ts
                            3) Must have a [NameModule].module.ts
                            4) Must be imported into parent module`;
        this.folders = ['components'];
        this.files = ['-routing.module.ts', '.module.ts']
    }

    isValidExtensionOfFileComponent(fileName: string): boolean {
        return  fileName.endsWith('.spec.ts') ||
                fileName.endsWith('.html') ||
                fileName.endsWith('.ts') ||
                fileName.endsWith('.css') ||
                fileName.endsWith('.scss');
    }

    isValidComponentsStructure(moduleDirectoryPath: string): boolean {
        const componentsPathModule = path.join(moduleDirectoryPath, 'components');
        const components = fs.readdirSync(componentsPathModule, 'utf-8');
        const allComponentsAreDirectories = components.every(component => fs.statSync(path.join(componentsPathModule, component)).isDirectory());
        
        let validate = allComponentsAreDirectories;
        let index = 0;
        while(validate && index < components.length) {
            const componentFiles = fs.readdirSync(path.join(componentsPathModule, components[index]), 'utf-8');
            validate = componentFiles.length === 4 && componentFiles.every(componentFile => this.isValidExtensionOfFileComponent(componentFile));
            if(validate) index += 1;
        }
        return validate;
    }

    isImportedIntoParentModule(moduleDirectoryPath: string): boolean {
        let parentModulePath = path.join(moduleDirectoryPath, '../../');
        if(path.basename(parentModulePath) === 'app') {
            parentModulePath = path.join(parentModulePath, 'modules');
        }
        let parentNameModule = path.basename(parentModulePath);
        
        const nameModule = path.basename(moduleDirectoryPath);
        const relativePath = path.relative(parentModulePath, moduleDirectoryPath);
        
        const parentFileModulePath = path.join(parentModulePath, `${parentNameModule}.module.ts`);

        const fileModulePath = path.join(relativePath, `${nameModule}.module.ts`);

        if(!fs.existsSync(parentFileModulePath)) return false;
        
        const imports = ToolUtils.getImports(parentFileModulePath);
        const importFound = imports.find(i => {
            const path = fileModulePath.replace('.ts', '').replace(/\\/g, '/');
            const regExp = new RegExp('(\s)?import.*from (\'|\")./' + path + '(\'|\")(;)?', 'g');
            return regExp.test(i);
        });

        return (importFound || '').length > 0;
    }

    isValidModuleStructure(moduleDirectoryPath: string): boolean {
        const moduleFiles = fs.readdirSync(moduleDirectoryPath, 'utf-8');
        const moduleName = path.basename(moduleDirectoryPath);

        const hasMandatoryFolders = this.folders.every(folder => moduleFiles.includes(folder));
        const hasMandatoryFiles = this.files.every(file => moduleFiles.includes(`${moduleName}${file}`));
        
        return hasMandatoryFolders &&
                hasMandatoryFiles &&
                this.isImportedIntoParentModule(moduleDirectoryPath) &&
                this.isValidComponentsStructure(moduleDirectoryPath);
    }

    run(context: IContext): Promise<string> {
        return new Promise((resolve, reject) => {
            const sourceFolder = path.join(context.getWorkspace(), 'src/app');
            glob(`${sourceFolder}/modules/**/*`, (err: any, files: any) => {
                if(err) reject(new StructureModuleException());
                const moduleDirectoryPaths = files.filter((file: fs.PathLike) => ToolUtils.isModuleDirectoryPath(file.toString()));
                let validate = moduleDirectoryPaths.length > 0;
                let index = 0;
                while(validate && index < moduleDirectoryPaths.length) {
                    if(validate = this.isValidModuleStructure(moduleDirectoryPaths[index])) index += 1;
                }

                validate ? resolve() : reject(new StructureModuleException(this.description, moduleDirectoryPaths[index]));
            });
        });
    }

}