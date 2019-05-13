export interface Element {
    id: number;
    name: string;
    fileName: string;
    type: ElementType;
    filePath: string;
    appearItems: Array<string>;
    moduleBelongs: string;
    routePaths: Array<string>;
    suggestedFeatureModule: string;
}

export interface ComponentElement extends Element {
    selector: string;
    elements: {
        template: string;
        styles: Array<string>;
        specs: string
    }
}

export interface ModuleElement extends Element {
    elements: Array<string>
}

export enum ElementType {
    MODULE = 'MODULE',
    COMPONENT = 'COMPONENT',
    SERVICE = 'SERVICE',
    DIRECTIVE = 'DIRECTIVE',
    PIPE = 'PIPE',
    GUARD = 'GUARD',
    ROUTER = 'ROUTER',
    UNKNOWN = 'UNKNOWN'
}
