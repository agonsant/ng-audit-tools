import * as fs from 'fs';

const angularPath = 'node_modules/@angular/core/package.json';

export function getAngularPackageJson(workSpace: string) {
    try{
        const path = `${workSpace}/${angularPath}`;
        const file = fs.readFileSync(path, 'utf-8');
        return JSON.parse(file);
    } catch (err) {
        return err;
    }
}