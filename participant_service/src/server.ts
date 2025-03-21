import express, {Application } from 'express'
import cors, { CorsOptions } from "cors"
import { config } from './config/Config'
import participantRoute from './routes/participant.route'
import { PermissionService } from './service/permission.service'
import { RoleService } from './service/role.service'
import globalErrorHandling from './middleware/Error.middleware'
import { EndpointService } from './service/endpoint.service'
import { ActionService } from './service/action.service'

const app: Application = express()
const permissionService: PermissionService = new PermissionService()
const roleService: RoleService = new RoleService()
const endpointService: EndpointService = new EndpointService()
const actionService: ActionService = new ActionService()

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
// app.options("*", cors(corsOptions));
app.use(cors(corsOptions))

app.use('/api/v1/participant-service', participantRoute)
app.use(globalErrorHandling)


const httpServer = app.listen(config.server.port || 5000, async () => {
    //insert permissions and roles into the table
    await permissionService.createBulkIfNotExist()
    await roleService.createBulkIfNotExist()
     
    //register routes
    await endpointService.registerRoute(participantRoute, '/api/v1/participant-service')
    await actionService.initCreateBulk()
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
