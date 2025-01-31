import { RowDataPacket } from "mysql2";
import { ParticipantStatus, ParticipantType } from "../utils/Enums";
import { v4 as uuidv4 } from 'uuid'

export class Participant {

    private id: string;
    private instituteName: string;
    private type: ParticipantType;
    private email: string;
    private phoneNumber: string;
    private address: string;
    private country: string;
    private status: ParticipantStatus;
    private createdAt?: Date;
    private updatedAt?: Date;

    private constructor() {
        this.id = uuidv4();
        this.instituteName = '';
        this.email = '';
        this.phoneNumber = '';
        this.address = '';
        this.country = '';
        this.type = ParticipantType.FinancialInstitution;
        this.status = ParticipantStatus.Active;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public static Builder() {
        return new Participant();
    }

    public setId(id: string): Participant {
        this.id = id;
        return this;
    }

    public setInstituteName(name: string): Participant {
        this.instituteName = name;
        return this;
    }

    public setEmail(email: string): Participant {
        this.email = email;
        return this;
    }

    public setPhoneNumber(phoneNumber: string): Participant {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public setAddress(address: string): Participant {
        this.address = address;
        return this;
    }

    public setCountry(country: string): Participant {
        this.country = country;
        return this;
    }

    public setType(type: ParticipantType): Participant {
        this.type = type;
        return this;
    }

    public setStatus(status: ParticipantStatus): Participant {
        this.status = status;
        return this;
    }

    public setCreatedAt(createdAt: Date): Participant {
        this.createdAt = createdAt;
        return this;
    }

    public setUpdatedAt(updatedAt: Date): Participant {
        this.updatedAt = updatedAt;
        return this;
    }

    // Getter methods
    public getId(): string | undefined {
        return this.id;
    }

    public getInstituteName(): string {
        return this.instituteName;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPhoneNumber(): string {
        return this.phoneNumber;
    }

    public getAddress(): string {
        return this.address;
    }

    public getCountry(): string {
        return this.country;
    }

    public getType(): ParticipantType {
        return this.type;
    }

    public getStatus(): ParticipantStatus {
        return this.status;
    }

    public getCreatedAt(): Date | undefined {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
}
