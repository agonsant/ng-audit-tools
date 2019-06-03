import { ITestCase } from '../types/i-test-case';

import { AppStructureTest } from './test-cases/app-structure-test';
import { AppModuleImportsTest } from './test-cases/app-module-imports-test';
import { AppAngularVersionTest } from './test-cases/app-angular-version-test';
import { AppCompodocTest } from './test-cases/app-compodoc-test';
import { AppLazyLoadingTest } from './test-cases/app-lazyLoading-test';
import { AppAdrTest } from './test-cases/app-adr-test';
import { AppElementsInjectedTest } from './test-cases/app-elements-injected-test';
import { AppCypressTest } from './test-cases/app-cypress-test';
import { AppTslintSonarTest } from './test-cases/app-tslint-sonar-test';
import { AppNumberImportsTest } from './test-cases/app-number-imports-test';
import { AppOneClassTest } from './test-cases/app-one-class-test';
import { AppStructurModule } from './test-cases/app-structure-module';
import { AppReadmeTest } from './test-cases/app-readme-test';

import { IAuditTool } from '../types/i-audit-tool';
import { IContext } from '../types/i-context';

export class FolderStructureAuditTool implements IAuditTool {

    private testCases: Array<ITestCase>;

    constructor() {
        this.testCases = [
            new AppStructureTest(),
            new AppModuleImportsTest(),
            new AppAngularVersionTest(),
            new AppCompodocTest(),
            new AppLazyLoadingTest(),
            new AppAdrTest(),
            new AppElementsInjectedTest(),
            new AppCypressTest(),
            new AppTslintSonarTest(),
            new AppNumberImportsTest(),
            new AppOneClassTest(),
            new AppStructurModule(),
            new AppReadmeTest(),
        ];
    }

    /**
     * Runs every test case declared in testCases variable, consoling it state
     * @param context the current app context
     */
    run(context: IContext): void {
        this.testCases.forEach(test => {
            test.run(context).then(() => { console.log(`${test.description}: OK`) }).catch(e => { console.log(e) });
        });
    }

}