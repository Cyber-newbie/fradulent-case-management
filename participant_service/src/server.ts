import express, {Application, Request, Response, } from 'express'
import cors, { CorsOptions } from "cors"
import { config } from './config/Config'
import participantRoute from './routes/participant.route'
import { PermissionService } from './service/permission.service'
import { RoleService } from './service/role.service'

const app: Application = express()
const permissionService: PermissionService = new PermissionService()
const roleService: RoleService = new RoleService()
const allowedOrigins: string[] = [config.server.origin]

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    console.log("origin: ", origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: This origin is not allowed!"));
    }
  },
  credentials: true
};


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors(corsOptions))
// app.use('/api/v1/auth', authRoute)
app.use('/api/v1/participant', participantRoute)
const httpServer = app.listen(config.server.port || 5000, async () => {

    //insert permissions and roles into the table
    await permissionService.createBulkIfNotExist()
    await roleService.createBulkIfNotExist()
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