import { log } from "console";
import { User, UserInterface, UserQuery } from "../entity/User"
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { ParticipantRepository } from "../repository/ParticipantRepository";
import { Participant } from "../entity/Participant";
import { PermissionService } from "./permission.service";

class ParticipantService {

    private participantRepository: ParticipantRepository = new ParticipantRepository()
    private permissionService: PermissionService = new PermissionService()
    
    private create = async (participant: Participant): Promise<number> => {
        console.log("creating participant....")
        try {

            const data: ResultSetHeader =  await this.participantRepository.create(participant);
            return data.insertId;
            
        } catch (error) {
            log('Error creating participant: ', error);
            throw new Error('Error c: ' + error);
        }
    }

    getParticipantById = async(id: number): Promise<Participant> => {
        const participant = await this.participantRepository.findById(id)
        return participant[0]
    }


    register = async (participant: Participant): Promise<Participant> => {
        try {
            
            const createdParticipantId = await this.create(participant)
            await this.permissionService.assignInitialPermissions(createdParticipantId)

            return await this.getParticipantById(createdParticipantId);

        } catch (error) {
            throw new Error("Error registering participant " + error)
        }

    }


}



export default ParticipantService;