import dotenv from 'dotenv';
import { Config } from '../utils/TypeUtilities';
import {parse} from 'yaml'
import fs from 'fs'
import path from 'path'
dotenv.config({path: `.env${process.env.NODE_ENV === "production" ? ".production" : "" }`});
console.log('dirname', __dirname)
const servicesPath = path.resolve(__dirname, "./services.yml")
const servicesYaml = fs.readFileSync(servicesPath, 'utf8')
const services = parse(servicesYaml)
// const { env }  = process
console.log("services ", services.participant)

export const config : Config = {
    server: {
        port: parseInt(process.env.SERVER_PORT || "") || 4001,
    }, 
    services: services

}