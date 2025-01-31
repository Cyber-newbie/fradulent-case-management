import { Pool, QueryResult, ResultSetHeader, RowDataPacket } from "mysql2/promise";

export interface IRepository<T = void> {
    
    tableName?: string;

    createTableQuery?: string;

    createTable?: (tableName:string, query: string) => Promise<void>;

    tableExists(tableName: string): Promise<boolean>;

    executeQuery(query: string): Promise<any>;

    create?: (data: T) => Promise<ResultSetHeader>   

    findById?: (id: number) => Promise<QueryResult>

    getAll?: () => Promise<T[]>
    
    update?: (data: T) => Promise<T>

    delete?: (id: number) => Promise<boolean>
}