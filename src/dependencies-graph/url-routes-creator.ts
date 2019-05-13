import * as fs from 'fs';
import * as path from 'path';

import { IContext } from '../types/i-context';
import { IRoute } from '../types/i-route';

const requireFromString = require('require-from-string');

export class UrlRoutesCreator {

    constructor() {

    }

    /**
     * Builds the Tree with the current app routes
     * @param context the app context
     */
    buildUrlRoutesTree(context: IContext) {
        this.getAppRoutes(context.getWorkspaceFiles());
        this.buildAppTree([]);
    }

    private getAppRoutes(workspaceFiles: Array<string>): void {
        const onlyModules = workspaceFiles.filter(file => /.*\.module\.ts/.test(file));
        onlyModules.forEach(m => {
            const file = fs.readFileSync(m, 'utf-8');
            const routesVarMatches = /RouterModule.forRoot\((.*?),/.exec(file);
            if (routesVarMatches) {
                const routesVar = routesVarMatches[1];
                const routesVarFilePath = this.getFilePathFromImports(file, routesVar);
                if (routesVarFilePath) {
                    const workspaceRoutesPaths = path.resolve(path.dirname(m), routesVarFilePath + '.ts');
                    const routes = this.getRoutesfromVariable(fs.readFileSync(workspaceRoutesPaths, 'utf-8'), routesVar);
                    console.log(routes);
                }
            }
        });
    }

    private buildAppTree(routes: Array<string>) {

    }

    private getFilePathFromImports(file: string, variable: string): string {
        const importRegex = new RegExp(`import\\s?{.*${variable}.*}\\s?from\\s?'(.*?)';?`);
        const routeMatches = importRegex.exec(file);
        return routeMatches ? routeMatches[1] : '';
    }

    /**
     * Retrieves all Angular routes in the file
     * @param file The file in which the paths are declared
     * @param variable the route path variable name
     */
    private getRoutesfromVariable(file: string, variable: string): Map<string, IRoute> {
        const varRegex = new RegExp(`${variable}\\s*=\\s*([\\s\\S]*?);`, 'gm');
        const varValue = varRegex.exec(this.removeComments(file));
        let finalRouteVar: string = '';
        if (varValue) {
            finalRouteVar = this.replaceRouterElementByString(varValue[1], /component:\s*(.*),?/mg, /component:\s*|}?,/g);
            finalRouteVar = this.replaceRouterElementByString(finalRouteVar, /canActivate(Child)?:\s*\[(.*)\],/mg, /canActivate(Child)?:\s*\[|\],/g);
        }
        const angularRoutes: Array<any> = requireFromString(`module.exports = ${finalRouteVar}`);
        return this.transformeAngularRoutes(angularRoutes);
    }

    /**
     * Transforms recursively all routes into an known object
     * @param angularRoutes the routes retrieve from angular app
     */
    private transformeAngularRoutes(angularRoutes: Array<any>): Map<string, IRoute> {
        const routes = new Map<string, IRoute>();
        angularRoutes.forEach(r => {
            if (r.path !== '**') {
                let route = {
                    path: r.path,
                    component: r.component,
                    childrens: new Map<string, IRoute>()
                } as IRoute;
                if (r.children) {
                    route.childrens = this.transformeAngularRoutes(r.children);
                }
                routes.set(r.path, route);
            }
        });
        return routes;
    }


    /**
     * Converts the Angular router elements in strings in order to do not have dependencies in the route path
     * object
     * @param routeVar the router path value
     * @param allElementRegex The router regex element to obtain
     * @param replacedElementRegex the router regex to obtain only the element for replacing it
     */
    private replaceRouterElementByString(routeVar: string, allElementRegex: RegExp, replacedElementRegex: RegExp): string {
        const auxMatch = routeVar.match(allElementRegex);
        if (auxMatch) {
            auxMatch.map(v => v.replace(replacedElementRegex, ''))
                .filter((v, i, self) => self.indexOf(v) === i)
                .forEach(v => routeVar = routeVar.replace(new RegExp(`\\b${v}\\b`, 'gm'), `'${v}'`));
        }
        return routeVar;
    }

    /**
     * Remove code comments from a text. It removes Multiline comments, one line comment
     * and HTML comments
     * @param txt the text to remove the comments
     */
    private removeComments(txt: string): string {
        const commentRegex = /\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|([^\\:]|^)\/\/.*/gm
        return txt.replace(commentRegex, '');
    }


}