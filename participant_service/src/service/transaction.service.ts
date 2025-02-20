import { AccountRepository, Transaction, TransactionRepository } from "@cms/db-repository"
import { TransactionDto } from "../dto/Transaction.dto";
import { createReadStream } from "fs";
import csv from "csv-parser";
import { Worker } from "worker_threads";
import path from "path";

export class transactionService {

    private storeFileChunks: Object[] = new Array()

    processJsonData = async (data: TransactionDto[]): Promise<void> => {
        try {
            console.log("Sending transaction data to worker:", data);

            const worker = new Worker(path.resolve(__dirname, "../worker/transactionWorker.ts"), {
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
            console.error("Error creating worker for Transaction Processing:", error);
        }
    };

    handleTransactionFile = async (file: Express.Multer.File): Promise<void> => {
        try {
            const content = createReadStream(file.path);
            const parser = content.pipe(csv());

            for await (const record of parser) {
                this.storeFileChunks.push(record);
            }

            console.log("Parsed transaction CSV data:", this.storeFileChunks);
            this.processJsonData(this.storeFileChunks as TransactionDto[]);
        } catch (error) {
            console.error("Error processing transaction file:", error);
            throw new Error("Error processing transaction file: " + error);
        }
    };

}