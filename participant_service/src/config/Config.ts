import dotenv from 'dotenv';
import { Config } from '../utils/TypeUtilities';
dotenv.config();

// const { env }  = process
export const config : Config = {
    server: {
        port: parseInt(process.env.SERVER_PORT || "") || 5000
    }, 

    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }

}