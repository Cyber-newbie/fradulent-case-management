import { NextFunction, Request, Response } from 'express';
import { ParsedQs } from "qs"
import { log } from 'console';
import ParticipantService from '../service/participant.service';
import { ParticipantDto } from '../dto/Participant.dto';
import { Participant} from '@cyber-newbie/db-repository';
import { bound } from '../decorator/helper.decorator';
import { customerService } from '../service/customer.service';
import { CustomerDto } from '../dto/Customer.dto';
import { AccountService } from '../service/account.service';
import { AccountDto } from '../dto/Account.dto';
import { transactionService } from '../service/transaction.service';
import { TransactionDto } from '../dto/Transaction.dto';
import { IResponseBody, ResponseBody } from '../dto/ResponseDto.dto';
import { AccountStatus } from '../utils/Enums';
import { UserService } from '../service/user.service';
import { IUserRoleDto } from '../dto/User.dto';
import { IUserLogin, Login } from '../dto/Login.dto';

export class ParticipantController {

    private participantService: ParticipantService = new ParticipantService();
    private customerService: customerService = new customerService()
    private accountService: AccountService = new AccountService()
    private transactionService: transactionService = new transactionService()
    private userService: UserService = new UserService()
    
    @bound
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

    @bound
    public async uploadCustomerDataJson(req: Request<unknown, unknown, CustomerDto[]>, res: Response): Promise<void> {
        try {
            console.log("customer req body: ", req.body)
            await this.customerService.processJsonData(req.body)
            res.status(201).json({
                message: "Processing data initialized, you will be notified "
            })
            
        } catch (error) {
            console.error("CONTROLLER UPLOAD CUSTOMER DATA ERROR")
            throw new Error("controller upload customer data: " + error)
        }

    }
    
   @bound
    public async uploadCustomerDataFile(  req: Request<{}, any, any, ParsedQs>, // Ensuring correct type order
        res: Response): Promise<void> {
        try {
            const file: Express.Multer.File | undefined = req.file ? req.file : undefined

            if(file) await this.customerService.handleCustomerFile(file)            
            else throw new Error("Please upload a file ")       

            res.status(201).json({message: "The data is processing, you will be notified."})
        } catch (error) {
            console.error("CONTROLLER UPLOAD CUSTOMER DATA ERROR")
            throw new Error("controller upload customer data: " + error)
        }

    }

    @bound
    public async uploadAccountDataJson(req: Request<unknown, unknown, AccountDto[]>, res: Response): Promise<void> {
        try {
            console.log("account req body: ", req.body)
            await this.accountService.processJsonData(req.body)
            
            res.status(201).json({
                message: "Account data inserted"
            })
            
        } catch (error) {
            console.error("CONTROLLER UPLOAD ACCOUNT DATA ERROR")
            throw new Error("controller upload account data: " + error)
        }

    }
    
   @bound
    public async uploadAccountDataFile(  req: Request<{}, any, any, ParsedQs>, // Ensuring correct type order
        res: Response): Promise<void> {
        try {
            const file: Express.Multer.File | undefined = req.file ? req.file : undefined

            if(file) await this.accountService.handleAccountFile(file)            
            else throw new Error("Please upload a file ")       

            res.status(201).json({message: "The data is processing, you will be notified."})
        } catch (error) {
            console.error("CONTROLLER UPLOAD ACCOUNT DATA ERROR")
            throw new Error("controller upload account data: " + error)
        }

    }

    @bound
    public async uploadTransactionDataJson(req: Request<unknown, unknown, TransactionDto[]>, res: Response): Promise<void> {
        try {
            console.log("account req body: ", req.body)
            await this.transactionService.processJsonData(req.body)

            res.status(201).json({
                message: "Account data inserted"
            })
            
        } catch (error) {
            console.error("CONTROLLER UPLOAD ACCOUNT DATA ERROR")
            throw new Error("controller upload account data: " + error)
        }

    }
    
   @bound
    public async uploadTransactionDataFile(  req: Request<{}, any, any, ParsedQs>, // Ensuring correct type order
        res: Response): Promise<void> {
        try {
            const file: Express.Multer.File | undefined = req.file ? req.file : undefined

            if(file) await this.transactionService.handleTransactionFile(file)            
            else throw new Error("Please upload a file ")       

            res.status(201).json({message: "The data is processing, you will be notified."})
        } catch (error) {
            console.error("CONTROLLER UPLOAD ACCOUNT DATA ERROR")
            throw new Error("controller upload account data: " + error)
        }

    }

    @bound
    public async getAccountsByStatus(req: Request<any, any, any, {status: AccountStatus}>,
         res: Response<IResponseBody<AccountDto[]>>): Promise<void> {

            const participantId = "9ec109cd-2cf3-4add-b74e-aeb7b866f4a1"
            const accountStatus = req.query.status
            const accounts = await this.accountService.getAllActiveAccounts(participantId, accountStatus)
               
            const response = new ResponseBody<AccountDto[]>(accounts)
            response.message = `fetched all accounts with status ${accountStatus}`

            res.status(200).json(response)

    }

    @bound
    public async createUserAndAssignRoles(req: Request<any, any, IUserRoleDto>,
         res: Response<IResponseBody>): Promise<void> {

            console.log("creating user....")

            const participantId = "9ec109cd-2cf3-4add-b74e-aeb7b866f4a1"
            try {
                const { user, roles } = req.body
                await this.userService.create(user, roles)
    
                const response = new ResponseBody(null)
                response.message = "User has been created and assigned roles."
    
                res.status(201).json(response)
                
            } catch (error) {
                console.error(error)
                res.status(500)            
            }

         }

    @bound 
    public async signInUser(req: Request<any, any, Login>,
         res: Response<IResponseBody<IUserLogin>>, next: NextFunction): Promise<void>  {
            
        try {

            const { user, token} = await this.userService.signin(req.body)
            const response = new ResponseBody<IUserLogin>({ user, token})
            response.message = "User logged in"
            res.status(200).json(response)

        } catch (error) {
             next(error)           
        }

    }    

}

