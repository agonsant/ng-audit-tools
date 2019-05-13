# ng-audit-tools

>Tools for auditing an Angular Application

## Contributing

This is a NodeJS project developed using TypeScript

### Starting the project

```shell
npm install
npm start [-- <angular_workspace>]
```

### Project structure

The project has the following structure

* *audit-tool.ts* the audit runner. It runs all available tools.
* *context.ts* The audit context. Currently it only has the workspace.

#### Test case

If you want to create a new test case in a tool, you just need to create a class extending from _ITestCase_, and implemented it throwing specific exceptions for the errors.

After that include it on its tool.

Example of test case:

```typescript
import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import * as fs from 'fs';
import * as path from 'path';
import { FolderStructureException } from '../exceptions/folder-structure-exception';

export class AppStructureTest implements ITestCase {

    description: string;

    constructor() {
        this.description = 'The app folder should only have: core, shared and modules folders';
    }

    run(context: IContext): Promise<string> {
        return new Promise(resolve => {
            const directoryPath = path.join(context.getWorkspace(), 'src', 'app');
            try {
                fs.statSync(directoryPath).isDirectory();
            } catch (err) {
                throw new FolderStructureException(`The folder ${directoryPath} does not exists`);
            }
            fs.readdir(directoryPath, (err, files) => {
                if (err) throw new FolderStructureException(err.message, files ? files.join(' ') : '');
                if (files.length === 3 && files.includes('core') &&
                    files.includes('shared') && files.includes('modules')) {
                    resolve()
                } else {
                    throw new FolderStructureException(this.description, files.join(' '));
                }
            });
        });
    }
}
```

And include it on its tool

```typescript
export class FolderStructureAuditTool implements IAuditTool {

    private testCases: Array<ITestCase>;

    constructor() {
        this.testCases = [
            new AppStructureTest()
        ];
    }
```


