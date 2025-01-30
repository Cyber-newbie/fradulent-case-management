import express, {Application, Request, Response, } from 'express'
import { config } from './config/Config'
import participantRoute from './routes/participant.route'

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use('/api/v1/auth', authRoute) 
app.use('/api/v1/participant', participantRoute)
app.listen(config.server.port || 5000, () => {

console.log(`Server is running on http://localhost:${config.server.port}`)
})