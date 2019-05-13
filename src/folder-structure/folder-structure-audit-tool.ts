import { ITestCase } from '../types/i-test-case';
import { AngularAppStructureTest } from './test-cases/angular-app-structure-test';
import { IAuditTool } from '../types/i-audit-tool';
import { IContext } from '../types/i-context';


export class FolderStructureAuditTool implements IAuditTool {

    private testCases: Array<ITestCase>;

    constructor() {
        this.testCases = [
            new AngularAppStructureTest()
        ];
    }

    run(context: IContext) {
        this.testCases.forEach(test => {
            test.run(context).then(() => { console.log(`${test.description}: OK`) }).catch(e => { console.log(e) });
        });
    }

}