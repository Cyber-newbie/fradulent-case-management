import { createReadStream } from "fs";
import csv from "csv-parser";
import { CustomerDto } from "../dto/Customer.dto";
import { Customer, CustomerRepository } from "@cyber-newbie/db-repository";
import { parentPort, workerData,  } from "worker_threads";

const customerRepository = new CustomerRepository

const insertBatchJson = async (data: CustomerDto[]): Promise<void> => {
    
    const message = {success: true, message: "customer data sucessfully inserted"}
    const errorMessage = {success: false, message: "Error occurred while transfering data"}
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


    try {
         await customerRepository.createBulk(customerData)
         console.log('worker ran in background')
         parentPort?.postMessage(message)
    } catch (error) {
        console.error("ERROR INSERTING CUSTOMER BULK JSON")
        parentPort?.postMessage(errorMessage)
        throw new Error("ERROR INSERTING CUSTOMER BULK: " + error)
    }

}

const handleCustomerFile = async (filePath: string): Promise<void> => {

    try {
        const storeFileChunks: any[] = new Array()
        const content = createReadStream(filePath)
        const parser = content.pipe(csv())
    
        for await (const record of parser){
            storeFileChunks.push(record)
        }
        
        const customerData = prepareCustomerData(storeFileChunks)
        console.log("customer data before creating: ", customerData)
        await customerRepository.createBulk(customerData)
        parentPort?.postMessage({success: true, message: "customer data sucessfully inserted"})
    } catch (error) {
        console.log("Error procerssing customer file: " + error)        
        parentPort?.postMessage({success: false, message: "Error occurred while transferring customer data"})
        throw new Error("Error procerssing customer file: " + error)
    }
    
}

const prepareCustomerData = (data: Object[]): Customer[] => {
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
workerData.type === "json" ? insertBatchJson(workerData.data) : handleCustomerFile(workerData.filePath)