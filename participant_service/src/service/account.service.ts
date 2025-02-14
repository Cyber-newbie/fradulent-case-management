import { Account, AccountRepository, CustomerRepository } from "@cms/db-repository"
import { AccountDto } from "../dto/Account.dto";
import { createReadStream } from "fs";
import csv from "csv-parser";


export class AccountService {

    private accountRepository: AccountRepository = new AccountRepository() 
    private customerRepository: CustomerRepository = new CustomerRepository()
    private storeFileChunks: Object[] = new Array()

insertBatchJson = async (data: AccountDto[]): Promise<void> => {

    const accountData: Account[] = [];
    for(const acc of data) {
    const customerData  = await this.customerRepository.getCustomerByEmail(acc.customerEmail)
    const account =  Account.Builder()
        .setParticipantId("9ec109cd-2cf3-4add-b74e-aeb7b866f4a1")
        .setCustomerId(customerData.id)
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

        console.log('chunks: ', this.storeFileChunks)
        
        const accountData = await this.prepareCustomerData(this.storeFileChunks)
        console.log("customer data before creating: ", accountData)
        await this.accountRepository.createBulk(accountData)
    } catch (error) {
        console.log("Error procerssing customer file: " + error)        
        throw new Error("Error procerssing customer file: " + error)
    }
    
}


private prepareCustomerData = (data: Object[]): Promise<Account[]> => {
    const accounts =  data.map(async (item: any) => {
        const customerData = await this.customerRepository.getCustomerByEmail(item?.customerEmail)
        return Account.Builder()
        .setParticipantId("9ec109cd-2cf3-4add-b74e-aeb7b866f4a1")
        .setCustomerId(customerData.id || "") 
        .setBalance(item?.balance || "")
        .setCurrency(item?.currency || "")
        .setType(item?.type || "")
        .setStatus(item?.status || "")
    })
    return Promise.all(accounts)
}

}