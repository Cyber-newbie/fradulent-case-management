import { EndpointRepository, Endpoint } from "@cyber-newbie/db-repository";
import { IRoute, IRouter } from "express";
import { RoutePath } from "../utils/TypeUtilities";
import { Method } from "../utils/Enums";

export class EndpointService { 

    private endpointRepository: EndpointRepository = new EndpointRepository()
    getRegisteredEndpoints = async (): Promise<Endpoint[] | null> => {

        const paths = await this.endpointRepository.getAll()
        return paths.length > 0 ? paths : null
    }

    listOfPaths = (route: IRouter, baseUrl: string, registeredPaths: Endpoint[] | null):
     RoutePath[] | null => 
        { 
            const paths: RoutePath[] = registeredPaths?.map(rp => ({ path: rp.getPath(), method: rp.getMethod() })) ??
             []; let routes: RoutePath[] = [...paths];
             
             for (const c of route.stack) {

                if (c.route?.stack && c.route.stack.length > 0) {
                    for (const r of c.route.stack) {
                        if(r.name !== "multerMiddleware") {

                            const routeInfo: RoutePath = {
                                path: baseUrl + c.route.path,
                                method: r.method.toUpperCase() as Method
                            };
                            // Check if route already exists before adding or removing
                            const exists = routes.some(rt => rt.path === routeInfo.path && rt.method === routeInfo.method);
                            if (exists) {
                                
                                routes = routes.filter(rt => !(rt.path === routeInfo.path && rt.method === routeInfo.method));
                            } else {
                                routes.push(routeInfo);
                            }
                        } 
                    }
                }
    }

    return routes;
    }

    registerRoute = async (route: IRouter, baseUrl: string) => {
        
        try {
            console.log("looking for new routes...")
            const registeredPaths = await this.getRegisteredEndpoints()
            console.log('already registered paths: ', registeredPaths)
            let routeList = this.listOfPaths(route, baseUrl, registeredPaths)  
            console.log("route list: ", routeList)
            
            if(routeList && routeList.length > 0){ 

                const endpoints = routeList?.map(r => Endpoint.Builder().setPath(r.path).setMethod(r.method))
                console.log("creating endpoints...")
                await this.endpointRepository.createBulk(endpoints)
                console.log("endpoints created.")
            }

        } catch (error) {
            throw new Error("Error registering route: " + error)
        }
}

}