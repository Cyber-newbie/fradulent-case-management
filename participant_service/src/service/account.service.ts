import { Account, AccountRepository, CustomerRepository } from "@cms/db-repository"
import { AccountDto } from "../dto/Account.dto";
import { createReadStream } from "fs";
import csv from "csv-parser";
import path from "path";
import { Worker } from "worker_threads";


export class AccountService {

    private storeFileChunks: Object[] = [];

    processJsonData = async (data: AccountDto[]): Promise<void> => {
        try {

            console.log("Sending account data to worker:", data);

            const worker = new Worker(path.resolve(__dirname, "../worker/accountWorker.ts"), {
                workerData: { type: "json", data },
                execArgv: ["-r", "ts-node/register"],
            });

            worker.on("message", (msg) => console.log("Message received from worker:", msg));
            worker.on("error", (err) => console.error("Worker Error:", err));
            worker.on("exit", (code) => {
                if (code !== 0) {
                    console.error(`Worker stopped with exit code ${code}`);
                }
            });
        } catch (error) {
            console.error("Error creating worker for Account Processing:", error);
        }
    };

    handleAccountFile = async (file: Express.Multer.File): Promise<void> => {
        try {
            const content = createReadStream(file.path);
            const parser = content.pipe(csv());

            for await (const record of parser) {
                this.storeFileChunks.push(record);
            }

            console.log("Parsed account CSV data:", this.storeFileChunks);
            this.processJsonData(this.storeFileChunks as AccountDto[]);
        } catch (error) {
            console.error("Error processing account file:", error);
            throw new Error("Error processing account file: " + error);
        }
    };

}