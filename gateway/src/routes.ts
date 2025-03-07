import { NextFunction, Request, Response} from "express"
import { config } from "./config/Config";
import axios from "axios";
import jwt from "jsonwebtoken"
import { UserRole, RolePermissionRepository, RolePermissions } from "@cyber-newbie/db-repository";
class GatewayRoute {

    private rolePermissions: RolePermissionRepository = new RolePermissionRepository()

    checkRoleEndpoint = (endpoint: string, method: string, permissions: RolePermissions[]) => {
        
        const permission = permissions.find(permissions => 
            permissions.getEndpoint() === endpoint && permissions.getMethod() === method)
        if(!permission) return false

        return true
    }

    getRolePermissions = async (userRoles: number[]): Promise<RolePermissions[]> => {

        let userPermissions: RolePermissions[] = []
        const permissions =  userRoles.map(async (roleId) => {
            // get role permissions
            return await this.rolePermissions.getRolesPermissions(roleId)
        })
        const rolePermissions = await Promise.all(permissions)

         userPermissions = rolePermissions.reduce((acc, rolePermission) => {
            
            return [...acc, ...rolePermission]
        }
        , userPermissions)

        return userPermissions
    }

    AuthorizeFilter = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
       
        const method = req.method
        const endpoint = req.originalUrl
                
        const token = req.headers?.authorization?.split(" ")[1] || ""
        if(!token) res.status(400).json({error: "unauthorized"})

        if(!jwt.verify(token, process.env.JWT_SECRET || "")) res.status(400).json({error: "unauthorized"})
        
        const { roles, participantId } = jwt.decode(token) as {roles: UserRole[], userId: string, participantId: string}
        req.headers["x-participant-id"] = participantId

        const userRolesId = roles.map(role => role.getRoleId())
        const permissions = await this.getRolePermissions(userRolesId)

        if(!this.checkRoleEndpoint(endpoint, method, permissions)) res.status(403).json({error: "Forbidden"})                

        next()
    }

    private getServiceUrl = (requestURL: string): string => {
        
        const services = config.services
        console.log("servicesss: ", services)

        for(const service of services) {
        
            const serviceType: string = Object.keys(service)[0]
            const serviceData = service[serviceType]

            if(requestURL.includes(serviceData.name)){

                const newUrl = `${serviceData.url}${requestURL}`
                return newUrl; 
            }
        }
        throw new Error("Service not found")
    }

    forwardRequest = async (req: Request, res: Response ): Promise<void> => {

        try {
            req.originalUrl = this.getServiceUrl(req.originalUrl)
            console.log("url: ", req.originalUrl)
            const headers = { ...req.headers }

            delete headers.host
            delete headers['content-length']           

            const config = {

                url: req.originalUrl,
                method: req.method,
                data: req.body,
                headers: headers,
                timeout: 5000
            }

            console.log("config: ", config)
            const response = await axios.request(config)
             res.json(response.data)
            return;
        } catch (error: any) {
            console.error(error)    
        if (error.response) {
         res.status(error.response.status).json(error.response.data);

           } else if (error.request) {

         res.status(504).json({ error: "Gateway Timeout: No response from target service" });
        } else {

         res.status(500).json({ error: "Internal Server Error" });
    
    }
    }
    }
}
export default new GatewayRoute();