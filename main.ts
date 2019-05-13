import { AuditTool } from './src/audit-tool';
import * as process from 'process';
import { Context } from './src/context';


const workspace = process.argv[2] ? process.argv[2] : process.cwd();
const context = new Context(workspace);
new AuditTool(context).run();