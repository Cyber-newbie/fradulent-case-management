import { createReadStream } from "fs";
import { AccountDto } from "../dto/Account.dto";
import csv from "csv-parser";
import { Account, AccountRepository, CustomerRepository } from "@cms/db-repository";
import { parentPort, workerData } from "worker_threads";


if(!workerData.data) throw new Error("No data recieved for worker thread")

const customerRepository: CustomerRepository = new CustomerRepository()
const accountRepository: AccountRepository = new AccountRepository()
const message = {success: true, message: "Account data insertion complete."}
const errorMessage = {success: false, message: "Error occurred during Account data insertion."}

const insertBatchJson = async (data: AccountDto[]): Promise<void> => {

    const accountData: Account[] = [];
    for(const acc of data) {
    const customerData  = await customerRepository.getCustomerByEmail(acc.customerEmail)
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
         await accountRepository.createBulk(accountData)
         parentPort?.postMessage(message)
    } catch (error) {
        console.error("ERROR INSERTING ACCOUNT BULK JSON")
        parentPort?.postMessage(errorMessage)
        throw new Error("ERROR INSERTING ACCOUNT BULK: " + error)
    }

}

if(workerData.type === "json")  insertBatchJson(workerData.data) 
