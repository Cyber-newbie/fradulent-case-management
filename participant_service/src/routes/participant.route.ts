import { Router } from "express";
import {ParticipantController} from "../controller/participant.controller";
import multer from "../middleware/multer";
import { AccountStatus, Action, UserRole } from "../utils/Enums";
import { AccountDto } from "../dto/Account.dto";
import { IResponseBody } from "../dto/ResponseDto.dto";
import { IUserRoleDto } from "../dto/User.dto";
import { IUserLogin, Login } from "../dto/Login.dto";
import { updateEndpointAccess } from "../middleware/access.middleware";

class ParticipantRouter {
    router: Router = Router()
    participantController: ParticipantController =   new ParticipantController()   
    
    //define routes for controllers
    // @ route /api/
    constructor(){  
        
        this.router.post('/register', this.participantController.register)
        this.router.post('/customer/json-data', updateEndpointAccess(UserRole.ADMIN, Action.UPLOAD_CUSTOMER_DATA) ,this.participantController.uploadCustomerDataJson)
        this.router.post('/customer/upload-data',updateEndpointAccess(UserRole.ADMIN, Action.UPLOAD_CUSTOMER_DATA), multer.single('data'), this.participantController.uploadCustomerDataFile)

        this.router.get<string, null, IResponseBody<AccountDto[]>, any, {status:AccountStatus}, any>
        ('/accounts', this.participantController.getAccountsByStatus)
        this.router.post('/account/json-data', updateEndpointAccess(UserRole.ADMIN, Action.UPLOAD_ACCOUNT_DATA), multer.single('data'), this.participantController.uploadAccountDataJson)
        this.router.post('/account/upload-data',updateEndpointAccess(UserRole.ADMIN, Action.UPLOAD_ACCOUNT_DATA) ,multer.single('data'), this.participantController.uploadAccountDataFile)

        this.router.post('/transaction/json-data',updateEndpointAccess(UserRole.ADMIN, Action.UPLOAD_TRANSACTION_DATA) ,multer.single('data'), this.participantController.uploadTransactionDataJson)
        this.router.post('/transaction/upload-data', updateEndpointAccess(UserRole.ADMIN, Action.UPLOAD_TRANSACTION_DATA),multer.single('data'), this.participantController.uploadTransactionDataFile)
        
        this.router.post<string, null, IResponseBody, IUserRoleDto>('/register/user', updateEndpointAccess(UserRole.MANAGER, Action.CREATE_USER_ASSIGN) 
        ,this.participantController.createUserAndAssignRoles)
        this.router.post<string, null, IResponseBody<IUserLogin>, Login>('/signin/user', this.participantController.signInUser) 

    }

}

export default new ParticipantRouter().router;