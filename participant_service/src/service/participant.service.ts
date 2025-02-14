import { log } from "console"
import { PermissionService } from "./permission.service"
import { ParticipantRepository, Participant } from "@cms/db-repository"
import { ResultSetHeader } from "mysql2"

class ParticipantService {

    private participantRepository: ParticipantRepository = new ParticipantRepository()
    private permissionService: PermissionService = new PermissionService()
    
    private create = async (participant: Participant): Promise<string> => {
        console.log("creating participant....")
        try {

            const data: ResultSetHeader =  await this.participantRepository.create(participant);
            return data.insertId.toString();
            
        } catch (error) {
            log('Error creating participant: ', error);
            throw new Error('Error c: ' + error);
        }
    }

    getParticipantById = async(id: string): Promise<Participant> => {
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