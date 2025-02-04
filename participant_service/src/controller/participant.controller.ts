import { Request, Response } from 'express';
import { log } from 'console';
import { UserInterface } from '../entity/User';
import ParticipantService from '../service/participant.service';
import { Participant } from '../entity/Participant';
import { ParticipantDto } from '../dto/ParticipantDto';


class ParticipantController {

    private participantService: ParticipantService = new ParticipantService();

    constructor() {
        this.register = this.register.bind(this);
    }

    public async register(req: Request<unknown, unknown, ParticipantDto>, res: Response): Promise<void> {
        try {

         const participant: Participant = Participant.Builder()
         .setAddress(req.body.address)
         .setCountry(req.body.country)
         .setEmail(req.body.email)
         .setPhoneNumber(req.body.phoneNumber)
         .setInstituteName(req.body.instituteName)
            
            log("Participant body: ", participant)
            const createdParticipant = await this.participantService.register(participant)
            
            res.status(201).json({message: "Participant registered.",
                 data: createdParticipant
                });

        } catch (error: any) {
            log(error)
            res.status(500).json({ error: error?.message });
        }
    }

    

}

export default ParticipantController;