import { Request, Response } from 'express';
import { ParsedQs } from "qs"
import { log } from 'console';
import ParticipantService from '../service/participant.service';
import { ParticipantDto } from '../dto/Participant.dto';
import { Participant} from '@cms/db-repository';
import { bound } from '../decorator/helper.decorator';
import { customerService } from '../service/customer.service';
import { CustomerDto } from '../dto/Customer.dto';
import { AccountService } from '../service/account.service';
import { AccountDto } from '../dto/Account.dto';

class ParticipantController {

    private participantService: ParticipantService = new ParticipantService();
    private customerService: customerService = new customerService()
    private accountService: AccountService = new AccountService()
    
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
            await this.customerService.insertBatchJson(req.body)
            res.status(201).json({
                message: "Customer data inserted"
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
            await this.accountService.insertBatchJson(req.body)

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

}

export default ParticipantController;