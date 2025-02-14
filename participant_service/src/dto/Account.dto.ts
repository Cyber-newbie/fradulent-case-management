import { AccountType, AccountStatus } from "../utils/Enums"; // Adjust path as needed

export interface AccountDto {
    id?: string;
    participantId: string;
    customerId: string;
    type: AccountType;
    balance: number;
    currency: string;
    status: AccountStatus;
    createdAt?: Date;
    updatedAt?: Date;
}
