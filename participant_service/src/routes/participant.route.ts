import { Router } from "express";
import { log } from "console";
import ParticipantController from "../controller/participant.controller";

class ParticipantRouter {

    router: Router = Router()
    participantController: ParticipantController =   new ParticipantController()   
    
    //define routes for controllers
    constructor(){   
        log('ParticipantRouter constructor called')
        this.router.post('/register', this.participantController.register)
    }

}

export default new ParticipantRouter().router;