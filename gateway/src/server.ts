import express, {Application, Request, Response, } from 'express'
import cors, { CorsOptions } from "cors"
import {config } from "./config/Config"
import Gateway from "./routes"

const app: Application = express()

const corsOptions: CorsOptions = {
    origin: "*",
    credentials: true
};


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))

app.use('/api/v1/*', Gateway.forwardRequest);
const httpServer = app.listen(config.server.port || 5000, async () => {

console.log(`Server is running on http://localhost:${config.server.port} env: ${process.env.NODE_ENV}`)

})

const handleServerClose = () => {

    console.log('Received SIGTERM: Closing server...');
    httpServer.close(() => {
      console.log('Server closed. Exiting process.');
      process.exit(0); // Exit with success code
    });
}

process.on('SIGTERM', handleServerClose);
process.on('SIGINT', handleServerClose);

