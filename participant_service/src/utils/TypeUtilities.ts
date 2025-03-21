import { RowDataPacket } from "mysql2"
import { ActionValues, Method } from "./Enums"

export type Config = {
    server: {
        port: number,
        origin: string
    },

    token: {
        secret: string,
        expiry: string
    },

    database: {
        host: string,
        user: string | undefined,
        password: string | undefined,
        database: string | undefined
    }
}

export interface CountResult extends RowDataPacket {
    totalCount: number;
}

export type RoutePath = { 

    path: string
    method: Method
    action?: string
}

export type methodAction = { method: Method, action: ActionValues }