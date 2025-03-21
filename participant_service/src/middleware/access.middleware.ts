import {  EndpointRepository, UserRoleRepository } from "@cyber-newbie/db-repository"
import { NextFunction, Request, RequestHandler, RequestParamHandler, Response } from "express"
import { AuthRequest } from "../dto/ResponseDto.dto"
import { EndpointService } from "../service/endpoint.service"

const endpointRepository = new EndpointRepository()
const userRoleRepository = new UserRoleRepository()
const endpointService = new EndpointService()


export function updateEndpointAccess<P, rsb, rqb, rq, l extends Record<string, any>>(
  requiredAction: string, 
  requiredRole: string
): RequestHandler<P, rsb, rqb, rq, l> {
  
  return async function rolePermissionMiddleware(
    req: AuthRequest<P, rsb, rqb, rq, l>, 
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    
    // console.log("checking endpoint access...");
    // console.log("req path: ", req.originalUrl);

    // const endpoint = await endpointRepository.findByPathAndMethod(req.originalUrl, req.method);

    // if (!req?.user?.id || req.participantId) {
    //    res.status(401).json({ message: "Unauthorized." });
    // }
    
    // if (!endpoint) {
    //    res.status(400).json({ message: "Invalid endpoint." });
    // }

    // endpoint.setAction(requiredAction);
    // if (!endpoint.getAction()) {
    //   await endpointService.updateEndpoint(endpoint);
    // }

    // const role = await userRoleRepository.getUserRoles(req?.user?.id || "");
    // const isRole = role.some(r => r.getRole() === requiredRole);

    // console.log("endpoint found: ", endpoint);
    // console.log("user roles: ", role);

    // if (endpoint.getAction() === requiredAction && isRole) {
    //   console.log("access granted.");
    //   return next();
    // } else {
    //   console.log("access denied.");
    //    res.status(403).json({ message: "Access denied." });
    // }
  };
}
