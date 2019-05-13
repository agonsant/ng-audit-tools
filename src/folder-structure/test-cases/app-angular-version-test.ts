import { ITestCase } from '../../types/i-test-case';
import { ToolUtils } from '../../utils/tool-utils';
import { AngularVersionException } from '../exceptions/angular-version-exception';
import { IContext } from '../../types/i-context';

export class AppAngularVersionTest implements ITestCase {

    description: string;
    versionRequired: number;
    angularPackagePath: string;

    constructor() {
        this.description = 'The angular version should be larger or equal';
        this.versionRequired = 8;
        this.angularPackagePath = 'node_modules/@angular/core/package.json';
    }

    run(context: IContext): Promise<string> {
        return new Promise(resolve => {
            const path = `${context.getWorkspace()}/${this.angularPackagePath}`;
            const jsonPackage = ToolUtils.getPackageJson(path);
            try {
                const {version} = jsonPackage;
                const currentVersion = version.split('.')[0];
                if(currentVersion >= this.versionRequired) {
                    resolve();
                } else {
                    throw new AngularVersionException(`The angular version is smaller than ${this.versionRequired}`, currentVersion);
                }
            } catch(err) {
                throw new AngularVersionException(`The angular version does not exists`);
            }
        });
    }

}