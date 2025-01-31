import { ParticipantStatus, ParticipantType } from "../utils/Enums";

export interface ParticipantDto {

     instituteName: string;
     type: ParticipantType;
     email: string;
     phoneNumber: string;
     address: string;
     country: string;
     status: ParticipantStatus;

}