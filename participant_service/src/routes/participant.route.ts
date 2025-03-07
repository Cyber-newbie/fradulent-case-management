import { Router, Response, Request, RequestHandler, RouterOptions } from "express";
import {ParsedQs} from "qs"
import {ParticipantController} from "../controller/participant.controller";
import multer from "../middleware/multer";
import { AccountStatus } from "../utils/Enums";
import { AccountDto } from "../dto/Account.dto";
import { IResponseBody } from "../dto/ResponseDto.dto";
import { IUserRoleDto } from "../dto/User.dto";
import { IUserLogin, Login } from "../dto/Login.dto";

class ParticipantRouter {
    router: Router = Router()
    participantController: ParticipantController =   new ParticipantController()   
    
    //define routes for controllers
    // @ route /api/
    constructor(){  
        this.router.post('/register', this.participantController.register)
        this.router.post('/customer/json-data', this.participantController.uploadCustomerDataJson)
        this.router.post('/customer/upload-data', multer.single('data'), this.participantController.uploadCustomerDataFile)

        this.router.get<string, null, IResponseBody<AccountDto[]>, any, {status:AccountStatus}, any>
        ('/accounts', this.participantController.getAccountsByStatus)
        this.router.post('/account/json-data', multer.single('data'), this.participantController.uploadAccountDataJson)
        this.router.post('/account/upload-data', multer.single('data'), this.participantController.uploadAccountDataFile)

        this.router.post('/transaction/json-data', multer.single('data'), this.participantController.uploadTransactionDataJson)
        this.router.post('/transaction/upload-data', multer.single('data'), this.participantController.uploadTransactionDataFile)
        
        this.router.post<string, null, IResponseBody, IUserRoleDto>('/register/user', this.participantController.createUserAndAssignRoles)
        this.router.post<string, null, IResponseBody<IUserLogin>, Login>('/signin/user', this.participantController.signInUser)

    }

}

export default new ParticipantRouter().router;