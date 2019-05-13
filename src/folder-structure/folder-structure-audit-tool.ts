import { ITestCase } from '../types/i-test-case';
import { AppStructureTest } from './test-cases/app-structure-test';
import { AppAngularVersionTest } from './test-cases/app-angular-version-test';
import { AppOneClassTest } from './test-cases/app-one-class-test';

import { IAuditTool } from '../types/i-audit-tool';
import { IContext } from '../types/i-context';


export class FolderStructureAuditTool implements IAuditTool {

    private testCases: Array<ITestCase>;

    constructor() {
        this.testCases = [
            new AppStructureTest(),
            new AppAngularVersionTest(),
            new AppOneClassTest()
        ];
    }

    run(context: IContext) {
        this.testCases.forEach(test => {
            test.run(context).then(() => { console.log(`${test.description}: OK`) }).catch(e => { console.log(e) });
        });
    }

}