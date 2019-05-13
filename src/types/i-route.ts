interface Route {
    path: string,
    component: string,
    childrens: Map<string,Route>
}

export type IRoute = Route;