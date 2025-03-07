
export type ServiceOption =  {name: string, url: string}
export type Services = Array<{ [key: string]: ServiceOption }>

export type Config = {
    server: {
        port: number,
    }

    services: Services
}
