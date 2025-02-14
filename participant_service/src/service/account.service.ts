import { Account, AccountRepository } from "@cms/db-repository"
import { AccountDto } from "../dto/Account.dto";
import { createReadStream } from "fs";
import csv from "csv-parser";


export class AccountService {

    private accountRepository: AccountRepository = new AccountRepository() 
    private storeFileChunks: Object[] = new Array()

insertBatchJson = async (data: AccountDto[]): Promise<void> => {

    const accountData: Account[] = [];
    for(const acc of data) {

    const account =  Account.Builder()
        .setParticipantId("9ec109cd-2cf3-4add-b74e-aeb7b866f4a1")
        .setCustomerId(acc.customerId)
        .setBalance(acc.balance)
        .setCurrency(acc.currency)
        .setType(acc.type)
        .setStatus(acc.status)

    accountData.push(account)    
    }

    console.log("Account data: ", accountData)

    try {
         await this.accountRepository.createBulk(accountData)
    } catch (error) {
        console.error("ERROR INSERTING ACCOUNT BULK JSON")
        throw new Error("ERROR INSERTING ACCOUNT BULK: " + error)
    }

}

handleAccountFile = async (file: Express.Multer.File): Promise<void> => {

    try {
        
        const content = createReadStream(file.path)
        const parser = content.pipe(csv())
    
        for await (const record of parser){
            this.storeFileChunks.push(record)
        }
        
        const customerData = this.prepareCustomerData(this.storeFileChunks)
        console.log("customer data before creating: ", customerData)
        await this.accountRepository.createBulk(customerData)
    } catch (error) {
        console.log("Error procerssing customer file: " + error)        
        throw new Error("Error procerssing customer file: " + error)
    }
    
}


private prepareCustomerData = (data: Object[]): Account[] => {
    return this.storeFileChunks.map((item: any) => {
        return Account.Builder()
        .setParticipantId("9ec109cd-2cf3-4add-b74e-aeb7b866f4a1")
        .setCustomerId(item.customerId || "") 
        .setBalance(item.balance || "")
        .setCurrency(item.currency || "")
        .setType(item.type || "")
        .setStatus(item.status || "")
    }
)
}

}