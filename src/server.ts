import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { corsOptions } from './config/cors'
import { connectDB } from './config/db'
import authRoute from './routes/authRoute'
import projectsRoute from './routes/projectsRoute'

connectDB()
const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cors(corsOptions))

app.use("/api/auth", authRoute)
app.use("/api/projects", projectsRoute)

export default app