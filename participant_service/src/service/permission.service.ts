import { ResultSetHeader } from "mysql2";
import { Permission } from "../entity/Permission";
import { PermissionRepository } from "../repository/PermissionRepository";

export class PermissionService {

    private permissionRepository: PermissionRepository = new PermissionRepository();
    private defaultPermissions: string[] = process.env.PERMISSIONS ? process.env.PERMISSIONS.split(" ") : []
    private bulkPermissions: Permission[] = [];

    constructor(){
        this.createBulkIfNotExist = this.createBulkIfNotExist.bind(this)

    }

    public async createBulkIfNotExist(): Promise<void> {

        const count: number = await this.getTotalCount()
        if(count === 0) {

            this.bulkPermissions = this.defaultPermissions.map((perm) => {

                    const permission: Permission = new Permission()
                    return permission.Builder().setAccess(perm)

            }, this)
            try {
            
                const result: ResultSetHeader = await this.permissionRepository.createBulk(this.bulkPermissions)
                console.log("PERMISSIONS BULK INSERT: ", result)             

            } catch (error) {
                throw new Error("Error while bulk insert permissions: " + error)                
            }
        }
    }

    async getTotalCount(): Promise<number>{
        return await this.permissionRepository.count()
    }


}