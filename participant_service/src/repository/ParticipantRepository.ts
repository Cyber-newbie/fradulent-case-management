import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import BaseRepository from "./BaseRepository";
import { IRepository } from "./IRepository";
import { Participant } from "../entity/Participant";

export class ParticipantRepository extends BaseRepository<Participant> implements IRepository<Participant> {

    private static tableName: string = "participants"
    private query: string = ""
    private static createTableQuery = `CREATE TABLE participants (
    id varchar(36) primary key, 
    institute_name VARCHAR(255) NOT NULL, 
    type VARCHAR(50) CHECK (type IN ('Financial Institution', 'Regulator', 'Other')), 
    email VARCHAR(255) UNIQUE NOT NULL, 
    phone_number VARCHAR(50), 
    address TEXT, 
    country VARCHAR(100), 
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);`

    constructor(){
       super(ParticipantRepository.tableName, ParticipantRepository.createTableQuery);
    }

    async create(data: Participant): Promise<ResultSetHeader> {

        this.query = `INSERT INTO participants (id, institute_name, type, email, phone_number, address, country, status) 
            VALUES ('${data.getId()}', '${data.getInstituteName()}', '${data.getType()}', '${data.getEmail()}', 
            '${data.getPhoneNumber()}', '${data.getAddress()}', '${data.getCountry()}', '${data.getStatus()}')`
        
            const result = await super.executeQuery<ResultSetHeader>(this.query)
            return result
    }

    async findById(id: number): Promise<Participant[]> {

           this.query = `SELECT * FROM participants WHERE id = ${id}`
            const result: RowDataPacket[] =  await super.executeQuery<RowDataPacket>(this.query)
            return result as Participant[];
    };

    async getAll(): Promise<Participant[]> {
        
        this.query = `SELECT * FROM participants`
        const result =  await super.executeQuery(this.query)
        return result as Participant[]

    };

    async update(data: Participant): Promise<ResultSetHeader> {

        this.query = `UPDATE participants SET institute_name =
         ${data.getInstituteName()}, type = ${data.getType()}, email = ${data.getEmail()}, phone_number=${data.getPhoneNumber()},
         address = ${data.getAddress()} , country = ${data.getCountry()} , status = ${data.getStatus()}
         WHERE id = ${data.getId()}`

        return  await super.executeQuery<ResultSetHeader>(this.query)
    };

    async delete(id: number): Promise<ResultSetHeader> {

        this.query = `DELETE FROM participants WHERE id = ${id}`
        return await super.executeQuery<ResultSetHeader>(this.query)
    };
}