import * as path from 'path';
import * as glob from 'glob';

import { IContext } from './types/i-context';

const gitignore = require('parse-gitignore');

export class Context implements IContext {


    private workspace: string;
    private packageJson: any;
    private angularVersion: string;
    private majorAngularVersion: number;
    private angularConfig: any
    private workspaceFiles: Array<string>;

    constructor(workspace: string) {
        this.workspace = workspace;
        this.packageJson = require(path.join(this.workspace, 'package.json'));
        this.angularVersion = this.generateAngularVersion();
        this.majorAngularVersion = parseInt(this.angularVersion.split('.')[0]);
        try {
            this.angularConfig = this.majorAngularVersion >= 6 ? require(path.join(this.workspace, 'angular.json'))
                : require(path.join(this.workspace, '.angular-cli.json'));
        } catch (err) {
            this.angularConfig = null;
        }
        this.workspaceFiles = this.buildPathIgnoringGlobs(this.workspace);
    }

    /**
     * Returns the workspace path as string
     */
    getWorkspace(): string {
        return this.workspace;
    }

    /**
     * Check if the workspace is an angular workspace
     */
    isAngular(): boolean {
        return this.angularVersion.length > 0 && this.angularConfig != null;
    }

    /**
     * Returns a string with the full angular version in format X.Y.Z
     */
    getCompleteAngularVersion(): string {
        return this.angularVersion;
    }

    /**
     * Returns the major number of the angular version in the given workspace
     */
    getMajorAngularVersion(): number {
        return this.majorAngularVersion;
    }

    /**
     * Returns an object with the workspace package.json
     */
    getWorkspacePackageJson(): any {
        return this.packageJson;
    }

    /**
     * returns an object with the angular.json|.angular-cli.json configuration
     */
    getAngularConfig(): any {
        return this.angularConfig;
    }

    /**
     * Returns the list of relevant files in the current workspace, ignoring .gitignore files
     */
    getWorkspaceFiles(): Array<string> {
        return this.workspaceFiles;
    }

    /**
     * 
     */
    private generateAngularVersion(): string {
        let version = '';
        if (this.packageJson.dependencies['@angular/core']) {
            version = require(path.join(this.workspace, 'node_modules', '@angular', 'core', 'package.json')).version;
        }
        return version;
    }

    /**
     * Builds a new filesystem by removing files matching the ignore globs using glob.
     * Returns as an array of files and folders.
     * @param rootpath original directory path
     */
    private buildPathIgnoringGlobs(rootpath: string): Array<string> {
        const options: glob.IOptions = {
            ignore: this.getGlobsFromGitignore(rootpath),
            nodir: true,
            cwd: rootpath
        }
        return glob.sync('**', options)
            .filter(file => /src\/app\//.test(file))
            .map(file => path.join(this.workspace, file));
    }

    /**
    * Parses .gitignore file into an array of ignoreGlobs and appends default ignoreGlobs 
    * to the array. Filters out patterns starting with ! from the ignoreGlobs array
    * because ! means to never ignore. Returns the globs to ignore.
    * @param rootpath original directory path
    */
    private getGlobsFromGitignore(rootpath: string): Array<string> {
        const defaultIgnoreGlobs = [
            'node_modules', 'node_modules/**', '**/node_modules', '**/node_modules/**',
            '.git', '.git/**', '**/.git', '**/.git/**',
            '*.json', '*.json/**', '**/*.json', '**/*.json/**',
            'e2e', 'e2e/**', '**/e2e', '**/e2e/**',
            '*.md', '*.md/**', '**/*.md', '**/*.md/**',
        ];
        return [...gitignore(rootpath + '/.gitignore'), ...defaultIgnoreGlobs].filter((pattern) => {
            return !pattern.startsWith("!");
        });
    }

}