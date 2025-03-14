import { Role, RolePermissionRepository, RoleRepository,  } from "@cyber-newbie/db-repository";

export class RoleService {

    private roleRepository: RoleRepository = new RoleRepository()
    private rolePermissionRepository = new RolePermissionRepository()
    private defaultRoles: string[] = process.env.USER_ROLES ? process.env.USER_ROLES.split(" ") : [] 
    
    createBulkIfNotExist = async (): Promise<void> => {
 
        try {
            
            const existRoles = await this.roleRepository.getAll()
            const roles = this.defaultRoles.map(role => Role.builder().setRole(role))
            if(existRoles.length === 0) await this.roleRepository.createBulk(roles)

        } catch (error) {
            
            console.error("role service create bulk error: ", error)
            throw new Error("role service create bulk error: " + error)
        }    
    }




}