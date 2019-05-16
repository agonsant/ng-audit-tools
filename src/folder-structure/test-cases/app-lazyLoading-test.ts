import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import { LazyLoadingException } from '../exceptions/lazyLoading-exception';

import * as path from 'path';
import * as fs from 'fs';
let glob = require('glob');

export class AppLazyLoadingTest implements ITestCase {

    description: string;

    constructor() {
        this.description = 'Lazy loading should be implemented';
    }

    run(context: IContext): Promise<string> {
        const pathBase = path.join(context.getWorkspace(), 'src/app');
        const routerModules = `${pathBase}/**/*router.module.ts`;
        return new Promise((resolve, reject) => {
            glob(routerModules, (err: any, files: any) => {
                if (err) reject(new LazyLoadingException());
                let index = 0;
                let validate = files.length > 0;
                while (validate && index < files.length) {
                    const buffer = fs.readFileSync(files[index], 'utf-8');
                    const regExpr = new RegExp('RouterModule\.forChild\(.+\)', 'g');
                    const matchsCount = (buffer.match(regExpr) || []).length;
                    if(validate = matchsCount === 1) index += 1;
                }

                if (!validate) reject(new LazyLoadingException(this.description, files[index]));
                resolve();
            });
        });
    }

}