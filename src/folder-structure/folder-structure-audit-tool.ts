import { ITestCase } from '../types/i-test-case';
import { AppStructureTest } from './test-cases/app-structure-test';
import { IAuditTool } from '../types/i-audit-tool';
import { IContext } from '../types/i-context';


export class FolderStructureAuditTool implements IAuditTool {

    private testCases: Array<ITestCase>;

    constructor() {
        this.testCases = [
            new AppStructureTest()
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