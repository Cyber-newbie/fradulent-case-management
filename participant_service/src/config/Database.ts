import {  ConnectionOptions, createConnection, Connection, createPool, Pool } from "mysql2/promise";
import {config} from "./Config";
import {  PoolOptions } from "mysql2/typings/mysql/lib/Pool";

class Database {
 private static pool: Pool

 constructor(){}

 static getPool(): Pool {
  
  if(!Database.pool){
    Database.pool = createPool({
      ...config.database
    })  
  }

  return Database.pool
 }
}

export default Database;