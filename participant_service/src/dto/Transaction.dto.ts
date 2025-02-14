import { TransactionPaymentMethod, TransactionStatus, TransactionType } from "../utils/Enums";

export interface TransactionDto {
    id?: string;
    customerEmail: string;
    participantId: string;
    accountId: string;
    type: TransactionType;
    amount: number;
    currency: string;
    paymentMethod: TransactionPaymentMethod;
    status: TransactionStatus;
    time: Date;
    createdAt?: Date;
    updatedAt?: Date;
}