import { Customer, CustomerRepository } from "@cms/db-repository"
import { CustomerDto } from "../dto/Customer.dto"
import { readFile,  } from "fs/promises";
import { pipeline } from "stream/promises";
import { createReadStream} from "fs";
import { CustomerKYCStatus } from "../utils/Enums";
import { Utility } from "../utils/utility";
import csv from "csv-parser";
import path from "path";
import { parentPort, Worker, workerData } from "worker_threads";

export class customerService {

    private customerRepository: CustomerRepository = new CustomerRepository() 
    private utility: Utility = new Utility()
    private storeFileChunks: Object[] = new Array()


    processJsonData = async (data: CustomerDto[]): Promise<void> => {

        try {
            
            const worker = new Worker(path.resolve(__dirname, "../worker/customerWorker.ts"), {
                workerData: {type: 'json',data},
                execArgv: ["-r", "ts-node/register"]
            })
            
            worker.on('message', (msg) => console.log("message recieved from worker ", msg))
               worker.on("error", (err) => console.error("Worker Error:", err));
                // Log worker exit event
                worker.on("exit", (code) => {
                    if (code !== 0) {
                        console.error(`Worker stopped with exit code ${code}`);
                    }
                });
        } catch (error) {
            console.error("Error creating worker for File Processing:", error);
        }


    }

handleCustomerFile = async (file: Express.Multer.File): Promise<void> => {

    try {

        const worker = new Worker(path.resolve(__dirname, "../worker/customerWorker.ts"), {
            workerData: { type: 'file', filePath: file.path},
            execArgv: ["-r", "ts-node/register"]
        })

            worker.on("message", (msg) => {
                console.log("file Worker Response:", msg);
            });

            worker.on("error", (err) => {
                console.error("file Worker Error:", err);
            });

            worker.on("exit", (code) => {
                if (code !== 0) {
                    console.error(`Worker stopped with exit code ${code}`);
                }
            });

        
    } catch (error) {
            console.error("Error creating worker for File Processing:", error);
        }
    
}

}