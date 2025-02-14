import { Router, Response, Request, RequestHandler } from "express";
import {ParsedQs} from "qs"
import { log } from "console";
import ParticipantController from "../controller/participant.controller";
import multer from "../middleware/multer";
import { CustomerDto } from "../dto/Customer.dto";

class ParticipantRouter {
  
    router: Router = Router()
    participantController: ParticipantController =   new ParticipantController()   
    
    //define routes for controllers
    constructor(){  
     
        log('ParticipantRouter constructor called')
        this.router.post('/register', this.participantController.register)
        this.router.post('/customer/json-data', this.participantController.uploadCustomerDataJson)
        this.router.post('/customer/upload-data', multer.single('data'), this.participantController.uploadCustomerDataFile)

        this.router.post('/account/json-data', multer.single('data'), this.participantController.uploadAccountDataJson)
        this.router.post('/account/upload-data', multer.single('data'), this.participantController.uploadAccountDataFile)
    }

}
export default new ParticipantRouter().router;