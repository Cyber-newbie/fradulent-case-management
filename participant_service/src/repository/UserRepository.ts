import { Pool, QueryResult, RowDataPacket } from "mysql2/promise";
import { User, UserInterface, UserQuery } from "../entity/User";
import { IRepository } from "./IRepository";
import Database from "../config/Database";
import BaseRepository from "./BaseRepository";

class UserRepository extends BaseRepository<User> implements IRepository<User>  {

    private static tableName: string = "users";
    private static createTableQuery: string = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;
    private query: string = "";



    constructor(){
        console.log(`calling super with table name: ${UserRepository.tableName} and query: ${UserRepository.createTableQuery}`);
       super(UserRepository.tableName, UserRepository.createTableQuery);
    }

    async create(user: User): Promise<User[]>{
        
        this.query = (`INSERT INTO users (name, email, password) 
        VALUES ('${user.name}', '${user.email}', '${user.password}')`)

     const [result] = await this.executeQuery(this.query);

        
        return result as User[];

    }


    public findById = async <T extends RowDataPacket>(id: number): Promise<T[]> => {


        this.query = `SELECT * FROM users WHERE id = ${id} LIMIT 1`

        const result = await this.executeQuery<T>(this.query);
        return result; 

    }
    getAll?: (() => Promise<User[]>) | undefined;
    // update?: ((data: User) => Promise<User>) | undefined;
    delete?: ((id: number) => Promise<boolean>) | undefined;



} 

export default UserRepository;