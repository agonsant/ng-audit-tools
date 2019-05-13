import { IContext } from './i-context';

interface AuditTool {
    run(context: IContext): void
}

export type IAuditTool = AuditTool;