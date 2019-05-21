import { ITestCase } from '../types/i-test-case';
import { AppStructureTest } from './test-cases/app-structure-test';
import { AppAngularVersionTest } from './test-cases/app-angular-version-test';
import { AppOneClassTest } from './test-cases/app-one-class-test';
import { AppNumberImportsTest } from './test-cases/app-number-imports-test';
import { AppModuleImportsTest } from './test-cases/app-module-imports-test';
import { AppElementsInjectedTest } from './test-cases/app-elements-injected-test';
import { AppCompodocTest } from './test-cases/app-compodoc-test';
import { AppCypressTest } from './test-cases/app-cypress-test';
import { AppAdrTest } from './test-cases/app-adr-test';
import { AppSonarlintTest } from './test-cases/app-sonarlint-test';
import { AppLazyLoadingTest } from './test-cases/app-lazyLoading-test';
import { AppReadmeTest } from './test-cases/app-readme-test';

import { IAuditTool } from '../types/i-audit-tool';
import { IContext } from '../types/i-context';

export class FolderStructureAuditTool implements IAuditTool {

    private testCases: Array<ITestCase>;

    constructor() {
        this.testCases = [
            new AppStructureTest(),
            new AppAngularVersionTest(),
            new AppOneClassTest(),
            new AppNumberImportsTest(),
            new AppModuleImportsTest(),
            new AppElementsInjectedTest(),
            new AppCompodocTest(),
            new AppCypressTest(),
            new AppAdrTest(),
            new AppSonarlintTest(),
            new AppLazyLoadingTest(),
            new AppReadmeTest(),
        ];
    }

    run(context: IContext) {
        this.testCases.forEach(test => {
            test.run(context).then(() => { console.log(`${test.description}: OK`) }).catch(e => { console.log(e) });
        });
    }

}