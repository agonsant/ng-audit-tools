import { IContext } from './types/i-context';

export class Context implements IContext {

    private workspace: string;

    constructor(workspace: string) {
        this.workspace = workspace;
    }

    getWorkspace(): string {
        return this.workspace;
    }

}