import { ResultSetHeader } from "mysql2";
import { ParticipantPermission } from "../entity/ParticipantPermission";
import BaseRepository from "./BaseRepository";
import { IRepository } from "./IRepository";

export class ParticipantPermissionRepository extends BaseRepository<ParticipantPermission> 
implements IRepository<ParticipantPermission> {

    private static tableName: string = "participant_permissions"
    private query: string = ""
    private static createTableQuery = `create table participant_permissions (participant_id varchar(36),permission_id int not null,
                                    constraint PK_Participant_Permission primary key(participant_id, permission_id));`

    constructor(){
       super(ParticipantPermissionRepository.tableName, ParticipantPermissionRepository.createTableQuery);

    }

    async createBulk(data: ParticipantPermission[]): Promise<ResultSetHeader> {
        const queryValues: String[] = [];
        
        data.forEach((item: any) => {
            const valueQuery = `('${item?.getPermissionId()}', '${item?.getParticipantId()}')`
            queryValues.push(valueQuery)
        })

         this.query = `INSERT INTO participant_permissions (permission_id, participant_id) 
            VALUES${queryValues.join()}`
        
            console.log("BULK QUERY: ", this.query)
            const result = await super.executeQuery<ResultSetHeader>(this.query)
            return result
 
    }

}