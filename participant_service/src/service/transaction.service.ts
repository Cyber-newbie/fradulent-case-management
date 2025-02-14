import { AccountRepository, Transaction, TransactionRepository } from "@cms/db-repository"
import { TransactionDto } from "../dto/Transaction.dto";
import { createReadStream } from "fs";
import csv from "csv-parser";
export class transactionService {

    private transactionRepository: TransactionRepository = new TransactionRepository() 
    private accountRepository: AccountRepository = new AccountRepository()
    private storeFileChunks: Object[] = new Array()

insertBatchJson = async (data: TransactionDto[]): Promise<void> => {

    const transactionData: any = new Array();
    for(const trx of data) {
    
        const account = await this.accountRepository.getAccountByCustomerEmail(trx.customerEmail)
        const transaction =  Transaction.Builder()
        .setAccountId(account.id)
        .setParticipantId("9ec109cd-2cf3-4add-b74e-aeb7b866f4a1")
        .setAmount(trx.amount)
        .setCurrency(trx.currency)
        .setType(trx.type)
        .setStatus(trx.status)
        .setPaymentMethod(trx.paymentMethod)
        .setTime(trx.time)
        
       transactionData.push(transaction) 
    }

    console.log("data transaction: ", transactionData)

    try {
        //  await this.transactionRepository.createBulk(transactionData)
    } catch (error) {
        console.error("ERROR INSERTING CUSTOMER BULK JSON")
        throw new Error("ERROR INSERTING CUSTOMER BULK: " + error)
    }

}

handleTramsactionFile = async (file: Express.Multer.File): Promise<void> => {

    try {
        
        const content = createReadStream(file.path)
        const parser = content.pipe(csv())
    
        for await (const record of parser){
            this.storeFileChunks.push(record)
        }
        
        const transactionData = await this.prepareCustomerData(this.storeFileChunks)
        console.log("transaction data before creating: ", transactionData)
        await this.transactionRepository.createBulk(transactionData)
    } catch (error) {
        console.log("Error procerssing customer file: " + error)        
        throw new Error("Error procerssing customer file: " + error)
    }


    
}

private fileListener = (data: Buffer<ArrayBufferLike> | string) => {
    console.log('before parsing data: ', data)
    const arrData = data.toString().split('\n').filter(row => row.trim() !== '') 
  .map(row => row.replace(/\r$/, '').split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
    console.log('after parsing data ', arrData)
  this.storeFileChunks.push(...arrData)

}

private prepareCustomerData = (data: Object[]): Promise<Transaction[]> => {
    const accountData =  this.storeFileChunks.map(async (item: any) => {
        const account = await this.accountRepository.getAccountByCustomerEmail(item?.customerEmail)
        return Transaction.Builder()
        .setAccountId(account.id)
        .setParticipantId("9ec109cd-2cf3-4add-b74e-aeb7b866f4a1")
        .setAmount(item?.amount || "")
        .setCurrency(item?.currency || "")
        .setType(item?.type || "")
        .setStatus(item?.status || "")
        .setPaymentMethod(item?.paymentMethod || "")
        .setTime(item?.time || "")
    })
    return Promise.all(accountData)
}


}