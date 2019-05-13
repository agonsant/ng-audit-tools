import { ITestCase } from '../../types/i-test-case';
import { getAngularPackageJson } from '../utils/angular-package-json';
import { AngularVersionException } from '../exceptions/angular-version-exception';
import { IContext } from '../../types/i-context';

export class AppAngularVersionTest implements ITestCase {

    description: string;
    versionRequired: number;
    constructor() {
        this.description = 'The angular version should be larger or equal';
        this.versionRequired = 8;
    }

    run(context: IContext): Promise<string> {
        return new Promise(resolve => {
            const workSpace = context.getWorkspace();
            const jsonPackage = getAngularPackageJson(workSpace);
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