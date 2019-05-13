import { IAuditTool } from '../types/i-audit-tool';
import { IContext } from '../types/i-context';
import { UrlRoutesCreator } from './url-routes-creator';


export class DependenciesGraphAuditTool implements IAuditTool {

    constructor() {

    }

    /**
     * Execute an algorithm to extract all Angular dependencies starting from the url route tree and 
     * deeping dive into the HTML and TS imports to build the dependencies graph in a json format.
     * It writes a json file with an array of {@link Element | interfaces}
     * @param context the current app context
     */
    run(context: IContext): void {
        const urlCreator = new UrlRoutesCreator();
        urlCreator.buildUrlRoutesTree(context);
    }

}