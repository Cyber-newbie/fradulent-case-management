import { Transaction, TransactionRepository } from "@cms/db-repository"
import { TransactionDto } from "../dto/Transaction.dto";
import { createReadStream } from "fs";
import csv from "csv-parser";
export class transactionService {

    private transactionRepository: TransactionRepository = new TransactionRepository() 
    private storeFileChunks: Object[] = new Array()

insertBatchJson = async (data: TransactionDto[]): Promise<void> => {

    const transactionData: any = new Array();
    for(const trx of data) {

    const transaction =  Transaction.Builder()
        .setAccountId(trx.accountId)
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
         await this.transactionRepository.createBulk(transactionData)
    } catch (error) {
        console.error("ERROR INSERTING CUSTOMER BULK JSON")
        throw new Error("ERROR INSERTING CUSTOMER BULK: " + error)
    }

}

handleCustomerFile = async (file: Express.Multer.File): Promise<void> => {

    try {
        
        const content = createReadStream(file.path)
        const parser = content.pipe(csv())
    
        for await (const record of parser){
            this.storeFileChunks.push(record)
        }
        
        const customerData = this.prepareCustomerData(this.storeFileChunks)
        console.log("customer data before creating: ", customerData)
        await this.transactionRepository.createBulk(customerData)
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

private prepareCustomerData = (data: Object[]): Transaction[] => {
    return this.storeFileChunks.map((item: any) => {
        return Transaction.Builder()
        .setAccountId(item?.accountId || "")
        .setParticipantId("9ec109cd-2cf3-4add-b74e-aeb7b866f4a1")
        .setAmount(item?.amount || "")
        .setCurrency(item?.currency || "")
        .setType(item?.type || "")
        .setStatus(item?.status || "")
        .setPaymentMethod(item?.paymentMethod || "")
        .setTime(item?.time || "")
    })
}


}