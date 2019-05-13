interface Context {
    getWorkspace(): string;
    isAngular(): boolean;
    getCompleteAngularVersion(): string;
    getMajorAngularVersion(): number;
    getWorkspacePackageJson(): any;
    getAngularConfig(): any;
    getWorkspaceFiles(): Array<string>;
}

export type IContext = Context;