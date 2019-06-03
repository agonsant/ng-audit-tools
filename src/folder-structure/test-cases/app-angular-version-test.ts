import { ITestCase } from '../../types/i-test-case';
import { ToolUtils } from '../../utils/tool-utils';
import { AngularVersionException } from '../exceptions/angular-version-exception';
import { IContext } from '../../types/i-context';

import * as path from 'path';

export class AppAngularVersionTest implements ITestCase {

    description: string;
    versionRequired: number;
    angularPackagePath: string;

    constructor() {
        this.versionRequired = 8;
        this.description = `The angular version should be larger or equal than ${this.versionRequired}`;
        this.angularPackagePath = 'node_modules/@angular/core/package.json';
    }

    run(context: IContext): Promise<string> {
        return new Promise((resolve, reject) => {
            const pathPackage = path.join(context.getWorkspace(), this.angularPackagePath);
            const jsonPackage = ToolUtils.getPackageJson(pathPackage);
            const {version} = jsonPackage;
            const currentVersion = version.split('.')[0];
            const validate = currentVersion >= this.versionRequired; 
            return validate ? resolve() : reject(new AngularVersionException(this.description, currentVersion));
        });
    }

}