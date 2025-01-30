import { Connection } from "mysql2/typings/mysql/lib/Connection";
import Database from "../config/Database";
import { Query, QueryError, QueryResult, Pool, RowDataPacket} from "mysql2/promise";
import { IRepository } from "./IRepository";
import { log } from "console";
import { User, UserInterface, UserQuery } from "../entity/User";

class BaseRepository<T> implements IRepository<T> {

    protected connection : Pool = Database.getPool();

    constructor(tableName?: string, query?: string){
        if(tableName && query){
            this.connection = Database.getPool();
            try {
                this.createTable(tableName, query);            
            } catch (error) {
                throw new Error("Error creating table: " + error);
            }

        }    
    }
   
       public async createTable(tableName: string, query: string): Promise<void> {
        console.log('create table func called')
        const isExist: boolean = await this.tableExists(tableName);
        if(!isExist){
            log("Table does not exist, creating table...");
            await this.executeQuery(query)
        }
    }



    public async tableExists(tableName: string): Promise<boolean> {
        try {
            const [result, ls]  = await this.connection.query(`SELECT 1 FROM ${tableName} LIMIT 1`);
            return true;
        } catch (error: any) {
            if(error?.code === "ER_NO_SUCH_TABLE") {
                return false;
            }
            throw new Error("Error checking if table exists: " + error);
        }
    }


    public async executeQuery<T extends RowDataPacket>(query: string): Promise<T[]> {
        try {

        const [queryResult, field] = await this.connection.query<T[]>(query);
         console.log("Query executed successfully");
         return queryResult;
        } catch (error) {
            console.error("Error executing query: " + error);
            throw new Error("Error executing query: " + error);
        }
    
    
}

}

export default BaseRepository;