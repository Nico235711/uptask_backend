import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { connectDB } from './config/db'
import projectsRoute from './routes/projectsRoute'
import { corsOptions } from './config/cors'

connectDB()
const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cors(corsOptions))

app.use("/api/projects", projectsRoute)

export default app