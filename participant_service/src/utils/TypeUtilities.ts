export type Config = {
    server: {
        port: number
    }
    database: {
        host: string,
        user: string | undefined,
        password: string | undefined,
        database: string | undefined
    }
}