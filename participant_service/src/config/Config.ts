import dotenv from 'dotenv';
import { Config } from '../utils/TypeUtilities';
dotenv.config({path: `.env${process.env.NODE_ENV === "production" ? ".production" : "" }`});

// const { env }  = process
const date = process.env.JWT_EXPIRE_DATE?.slice(0, process.env.JWT_EXPIRE_DATE?.indexOf("D")) || "1"
// const expireDate = `${parseInt(date)}D` || `${1}D`

export const config : Config = {
    server: {
        port: parseInt(process.env.SERVER_PORT || "") || 5000,
        origin: process.env.ORIGIN || ""
    },
    
    token: {
        secret: process.env.JWT_SECRET || "SECRET",
        expiry: date 
    },

    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }

}