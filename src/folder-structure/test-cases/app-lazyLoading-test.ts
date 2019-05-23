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
        const sourceAppPath = path.join(context.getWorkspace(), 'src/app');
        const appRoutingModulePath = path.join(sourceAppPath, 'app-routing.module.ts');
        return new Promise((resolve, reject) => {
            if (!ToolUtils.hasLazyLoading(appRoutingModulePath)) {
                return reject(new LazyLoadingException(this.description, appRoutingModulePath));
            }
            
            glob(`${sourceAppPath}/**/*-routing.module.ts`, (err: Error, filesPath: string[]) => {
                if (err) return reject(new LazyLoadingException());
                let index = 0;
                let validate = filesPath.length > 0;
                while (validate && index < filesPath.length) {
                    if(validate = ToolUtils.hasLazyLoading(filesPath[index])) index += 1;
                }
    
                return validate ? resolve() : reject(new LazyLoadingException(this.description, filesPath[index]));
            });
            
        });
    }

}