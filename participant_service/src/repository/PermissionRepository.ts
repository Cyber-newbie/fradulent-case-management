import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import BaseRepository from "./BaseRepository";
import { IRepository } from "./IRepository";
import { Permission } from "../entity/Permission";
import { CountResult } from "../utils/TypeUtilities";

export class PermissionRepository extends BaseRepository<Permission> implements IRepository<Permission> {

    private static tableName: string = "permissions"
    private query: string = ""
    private static createTableQuery = `create table permissions (
id int primary key auto_increment,
access varchar(100) unique not null 
);`

    constructor(){
       super(PermissionRepository.tableName, PermissionRepository.createTableQuery);

    }

    async createBulk(data: Permission[]): Promise<ResultSetHeader> {
        const queryValues: String[] = [];
        data.forEach((item) => {
            const valueQuery = `('${item.getAccess()}')`
            queryValues.push(valueQuery)
        })

         this.query = `INSERT INTO permissions (access) 
            VALUES${queryValues.join()}`
        
            console.log("BULK QUERY: ", this.query)
            const result = await super.executeQuery<ResultSetHeader>(this.query)
            return result
 
    }

    async create(data: Permission): Promise<ResultSetHeader> {

        this.query = `INSERT INTO permissions (id, access) 
            VALUES ('${data.getId()}', '${data.getAccess()}')`
        
            const result = await super.executeQuery<ResultSetHeader>(this.query)
            return result
    }

    async findById(id: number): Promise<Permission[]> {

           this.query = `SELECT * FROM participants WHERE id = ${id}`
            const result: RowDataPacket[] =  await super.executeQuery<RowDataPacket>(this.query)
            return result as Permission[]
    };

    async getAll(): Promise<Permission[]> {
        
        this.query = `SELECT * FROM participants`
        const result:RowDataPacket[] =  await super.executeQuery<RowDataPacket>(this.query)
        return result as Permission[]

    };

    async update(data: Permission): Promise<ResultSetHeader> {

        this.query = `UPDATE permissions SET access = ${data.getAccess()}
        WHERE id = ${data.getId()}`

        return await super.executeQuery<ResultSetHeader>(this.query)       
    };

    async delete(id: number): Promise<ResultSetHeader> {

        this.query = `DELETE FROM participants WHERE id = ${id}`
        return await super.executeQuery<ResultSetHeader>(this.query)
    };


    async count(): Promise<number>{

         this.query = `SELECT COUNT(*) as totalCount FROM permissions`
            const result: CountResult[] = await super.executeQuery<CountResult>(this.query)
        return result[0].totalCount
    }

}