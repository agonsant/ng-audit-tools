import { ITestCase } from '../../types/i-test-case';
import { IContext } from '../../types/i-context';
import { LazyLoadingException } from '../exceptions/lazyLoading-exception';
import { ToolUtils } from '../../utils/tool-utils';

import * as path from 'path';
let glob = require('glob');

export class AppLazyLoadingTest implements ITestCase {

    description: string;

    constructor() {
        this.description = 'Lazy loading should be implemented';
    }

    run(context: IContext): Promise<string> {
        const pathBase = path.join(context.getWorkspace(), 'src/app');
        const appRouterModule = path.join(pathBase, 'app-routing.module.ts');
        return new Promise((resolve, reject) => {
            if (!ToolUtils.hasLazyLoading(appRouterModule)) reject(new LazyLoadingException(this.description, appRouterModule));
            
            glob(`${pathBase}/**/modules/**/*-routing.module.ts`, (err: any, files: any) => {
                if (err) reject(new LazyLoadingException());
                let index = 0;
                let validate = true;
                while (validate && index < files.length) {
                    if(validate = ToolUtils.hasLazyLoading(files[index])) index += 1;
                }
    
                if (!validate) reject(new LazyLoadingException(this.description, files[index]));
                resolve();
            });
            
        });
    }

}