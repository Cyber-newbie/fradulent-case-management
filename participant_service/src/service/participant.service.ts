import { log } from "console"
import { PermissionService } from "./permission.service"
import { ParticipantRepository, Participant } from "@cms/db-repository"
import { ResultSetHeader } from "mysql2"

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
    
    uploadTransactionDataByJSON = async (): Promise<void> => {

    }


    uploadTransactionDataByFile = async (): Promise<void> => {

    }

    uploadCustomerDataByJSON = async (): Promise<void> => {

    }


    uploadCustomerDataByFile = async (): Promise<void> => {

    }



}



export default ParticipantService;