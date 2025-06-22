import express from 'express'
import morgan from 'morgan'
import { connectDB } from './config/db'
import projectsRoute from './routes/projectsRoute'

connectDB()
const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.use("/api/projects", projectsRoute)

export default app