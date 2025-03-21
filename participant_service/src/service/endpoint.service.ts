import { EndpointRepository, Endpoint, ActionRepository } from "@cyber-newbie/db-repository";
import { IRoute, IRouter } from "express";
import { methodAction, RoutePath } from "../utils/TypeUtilities";
import { ActionValues, Method } from "../utils/Enums";



export class EndpointService { 

    private endpointRepository: EndpointRepository = new EndpointRepository()
    private actionRepository: ActionRepository = new ActionRepository()
    private rules: Map<RegExp, methodAction> = new Map<RegExp, methodAction>()

    constructor(){

    this.rules.set(/\/customer.*upload/i, {method: Method.POST, action: ActionValues.UPLOAD_CUSTOMER_DATA});
    this.rules.set(/\/customer.*json/i, {method: Method.POST, action: ActionValues.UPLOAD_CUSTOMER_DATA});

    this.rules.set(/\/transaction.*upload/i, {method: Method.POST, action: ActionValues.UPLOAD_TRANSACTION_DATA});
    this.rules.set(/\/transaction.*json/i, {method: Method.POST, action: ActionValues.UPLOAD_TRANSACTION_DATA});

    this.rules.set(/\/account.*upload/i, {method: Method.POST, action: ActionValues.UPLOAD_ACCOUNT_DATA});
    this.rules.set(/\/account.*json/i, {method: Method.POST, action: ActionValues.UPLOAD_ACCOUNT_DATA});

    this.rules.set(/\/accounts?$/i, {method: Method.GET, action: ActionValues.READ_ACCOUNT_DATA});

    this.rules.set(/\/register.*user/i, {method: Method.POST, action: ActionValues.CREATE_USER_ASSIGN});
    this.rules.set(/\/register/i, {method: Method.POST, action: ActionValues.CREATE_USER_ASSIGN});
            
    }

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
                    console.log("route stack: ", c.route.path)
                    for (const r of c.route.stack) {
                        console.log(c.route.stack)
                        //we do not want to iterate over middleware layer
                        if(!r.name.includes("Middleware")) {

                            const routeInfo: RoutePath = {
                                path: baseUrl + c.route.path,
                                method: r.method.toUpperCase() as Method
                            };
                            // Check if route already exists before adding or removing
                            const exists = routes.some(rt => rt.path === routeInfo.path && rt.method === routeInfo.method);
                            if (exists) {

                                // console.log("route info: ", routeInfo)
                                // console.log("before filter: ", routes)                                
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

                const promiseRoutes = routeList?.map(async r => {
                       
                    const title: string | undefined = this.getActionByRule(r.path, r.method)?.valueOf()

                    let endpoint = await this.actionRepository.getActionByTitle(title || "")       
                    endpoint.setMethod(r.method).setPath(r.path)
                    console.log("path and method: ", r.path, r.method)
                    console.log("action title: ", title)
                    console.log('endpoint obj: ', endpoint)
                    return endpoint

                })

                const routes = await Promise.all(promiseRoutes)
                console.log("creating endpoints...: ", routes)
                await this.endpointRepository.createBulk(routes)
                console.log("endpoints created.")
            }

        } catch (error) {
            throw new Error("Error registering route: " + error)
        }
}

updateEndpoint = async (data: Endpoint) => {

    try {
        const endpoint = await this.endpointRepository.findByPathAndMethod(data.getPath(), data.getMethod())
        if(!endpoint) throw new Error("Endpoint not found.")
        
        endpoint.setAction(data.getAction() || 0)
        await this.endpointRepository.update(endpoint)    
        
    } catch (error) {
        throw new Error("Error updating endpoint: " + error)
    }
} 

getActionByRule = (path: string, method: string): ActionValues | null=> {

    let endpointAction: ActionValues | null = null;

    for(const [key, value] of this.rules.entries()){
        if(key.test(path) && value.method === method ){
            endpointAction = value.action
        }    
    }
     
    return endpointAction
 }

}