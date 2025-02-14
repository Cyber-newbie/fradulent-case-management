import { Customer, CustomerRepository } from "@cms/db-repository"
import { CustomerDto } from "../dto/Customer.dto"
import { readFile,  } from "fs/promises";
import { pipeline } from "stream/promises";
import { createReadStream} from "fs";
import { CustomerKYCStatus } from "../utils/Enums";
import { Utility } from "../utils/utility";
import csv from "csv-parser";

export class customerService {

    private customerRepository: CustomerRepository = new CustomerRepository() 
    private utility: Utility = new Utility()
    private storeFileChunks: Object[] = new Array()

insertBatchJson = async (data: CustomerDto[]): Promise<void> => {

    const customerData: any = [];
    for(const ctm of data) {

    const customer =  Customer.Builder()

        .setParticipantId("9ec109cd-2cf3-4add-b74e-aeb7b866f4a1")
        .setFirstName(ctm.firstName)
        .setLastName(ctm.lastName)
        .setEmail(ctm.email)
        .setKycStatus(ctm.kycStatus)
        .setAddress(ctm.address || null)
        .setPhoneNumber(ctm.phoneNumber || null)
        
       customerData.push(customer) 
    }

    console.log("data customer: ", customerData)

    try {
         await this.customerRepository.createBulk(customerData)
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
        await this.customerRepository.createBulk(customerData)
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

private prepareCustomerData = (data: Object[]): Customer[] => {
    return data.map((item: any) => {
        return Customer.Builder()
        .setParticipantId("9ec109cd-2cf3-4add-b74e-aeb7b866f4a1")
        .setFirstName(item?.firstName || "")
        .setLastName(item?.lastName || "")
        .setEmail(item?.email || "")
        .setAddress(item?.address || "")
        .setPhoneNumber(item?.phoneNumber || "")
        .setKycStatus(item?.kycStatus || "")
    })
}


}