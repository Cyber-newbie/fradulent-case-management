import express, {Application, Request, Response, } from 'express'
import { config } from './config/Config'
import participantRoute from './routes/participant.route'
import { PermissionService } from './service/permission.service'

const app: Application = express()
const permissionService: PermissionService = new PermissionService()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use('/api/v1/auth', authRoute)
app.use('/api/v1/participant', participantRoute)
const httpServer = app.listen(config.server.port || 5000, async () => {

    //insert permissions into the table
    await permissionService.createBulkIfNotExist()
console.log(`Server is running on http://localhost:${config.server.port}`)

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