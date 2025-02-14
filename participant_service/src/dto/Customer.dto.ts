import { CustomerKYCStatus } from "../utils/Enums";

export interface CustomerDto {

     id: string;
     participantId: string;
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber?: string | null;
     address?: string | null;
     kycStatus: CustomerKYCStatus;
     createdAt?: Date | null;
     updatedAt?: Date | null;

}