import { IContext } from './types/i-context';
import { IAuditTool } from './types/i-audit-tool';
import { FolderStructureAuditTool } from './folder-structure/folder-structure-audit-tool';


export class AuditTool {

    private context: IContext;
    private tools: Array<IAuditTool>;

    constructor(context: IContext) {
        this.context = context;
        this.tools = [
            new FolderStructureAuditTool()
        ]
    }

    run(): void {
        this.tools.forEach(tool => tool.run(this.context));
    }
}