import { AccountRepository, Transaction, TransactionRepository } from "@cms/db-repository";
import { TransactionDto } from "../dto/Transaction.dto";
import { parentPort, workerData } from "worker_threads";


const transactionRepository = new TransactionRepository();
const accountRepository = new AccountRepository();

console.log("Worker received data:", workerData);

if (!workerData?.data || !Array.isArray(workerData.data)) {
    parentPort?.postMessage({ success: false, message: "Invalid worker data format" });
    process.exit(1);
}

const insertBatchJson = async (data: TransactionDto[]): Promise<void> => {
    try {
        const transactionData: Transaction[] = await Promise.all(
            data.map(async (trx) => {
                const account = await accountRepository.getAccountByCustomerEmail(trx.customerEmail);
                return Transaction.Builder()
                    .setAccountId(account?.id || "")
                    .setParticipantId("9ec109cd-2cf3-4add-b74e-aeb7b866f4a1")
                    .setAmount(trx.amount)
                    .setCurrency(trx.currency)
                    .setType(trx.type)
                    .setStatus(trx.status)
                    .setPaymentMethod(trx.paymentMethod)
                    .setTime(trx.time);
            })
        );

        console.log("Transaction data to insert:", transactionData);
        await transactionRepository.createBulk(transactionData);

        parentPort?.postMessage({ success: true, message: "Transaction data successfully inserted" });
    } catch (error) {
        console.error("ERROR INSERTING TRANSACTION BULK JSON:", error);
        parentPort?.postMessage({ success: false, message: "Error occurred while inserting data" });
    }
};

insertBatchJson(workerData.data);