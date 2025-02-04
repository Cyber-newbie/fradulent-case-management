import { ResultSetHeader } from "mysql2";
import { Permission } from "../entity/Permission";
import { PermissionRepository } from "../repository/PermissionRepository";
import { bound } from "../decorator/helper.decorator";
import { ParticipantPermission } from "../entity/ParticipantPermission";
import { ParticipantPermissionRepository } from "../repository/ParticipantPermissionRepository";

export class PermissionService {

    private permissionRepository: PermissionRepository = new PermissionRepository();
    private participantPermissionRepository: ParticipantPermissionRepository = new ParticipantPermissionRepository();
    private defaultPermissions: string[] = process.env.PERMISSIONS ? process.env.PERMISSIONS.split(" ") : []
    private bulkPermissions: Permission[] = [];

    @bound
    public async createBulkIfNotExist(): Promise<void> {

        const count: number = await this.getTotalCount()
        if(count === 0) {

            this.bulkPermissions = this.defaultPermissions.map((perm) => {

                    return Permission.Builder().setAccess(perm)

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

    async getAllPermissions(): Promise<Permission[]>{
        const result = await this.permissionRepository.getAll();
        return result.map(perm => {
            return Permission.Builder().setId(perm?.id).setAccess(perm?.access)
        })
    }

    async assignInitialPermissions(participantId: number): Promise<void> {

        try {

            const permissions: Permission[] = await this.getAllPermissions();           
            let participantPermissions: ParticipantPermission[] = []
            
            console.log("All permissions: ", permissions)

            participantPermissions = permissions.map((item: Permission) => {
                return  (ParticipantPermission as any)
                ?.Builder()
                ?.setParticipantId(participantId)
                ?.setPermissionId(item.getId())
            }) 

            await this.participantPermissionRepository.createBulk(participantPermissions)

        } catch (error) {
            throw new Error("Error assigning permissions to participant: " + error)
        }
    }


}