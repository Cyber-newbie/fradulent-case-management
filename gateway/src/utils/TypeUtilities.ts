
export type Config = {
    server: {
        port: number,
    }

    services: [{name: string, url: string}]
}
