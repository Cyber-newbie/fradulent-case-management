import { RowDataPacket } from "mysql2"

export type Config = {
    server: {
        port: number,
        origin: string
    }
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