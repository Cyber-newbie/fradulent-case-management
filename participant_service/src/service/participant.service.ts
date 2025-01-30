import { log } from "console";
import { User, UserInterface, UserQuery } from "../entity/User"
import { QueryResult } from "mysql2";
import { ParticipantRepository } from "../repository/ParticipantRepository";
import { Participant } from "../entity/Participant";

class ParticipantService {

    private participantRepository: ParticipantRepository = new ParticipantRepository()

     create = async (participant: Participant): Promise<Participant[]> => {
        console.log("creating participant....")
        try {
            const data: Participant[] =  await this.participantRepository.create(participant);
            console.log('participant created: ', data);
            
            return data;
            
        } catch (error) {
            log('Error creating participant: ', error);
            throw new Error('Error c: ' + error);
        }
    }

}



export default ParticipantService;