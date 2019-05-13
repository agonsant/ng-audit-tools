import { AuditTool } from './src/audit-tool';
import * as process from 'process';
import { Context } from './src/context';
// import * as child from 'child_process';


const workspace = process.argv[2] ? process.argv[2] : process.cwd();
const context = new Context(workspace);
if (context.isAngular()) {
    new AuditTool(context).run();
} else {
    console.error(`Angular Project Not Found in : ${workspace}`);
}


// const exec = require('child_process').exec;

// child.exec('npm view @angular/core version', (error, stdout, stderr) => {
//     console.error(error);
//     console.warn(stderr);
//     console.log(stdout);
// });

// child.exec(`npm list @angular/core --prefix ${workspace}`, (error, stdout, stderr) => {
//     console.error(error);
//     console.warn(stderr);
//     console.log(stdout.split(/@angular\/core@/)[1]);
// });