import { Document, model, Schema } from "mongoose"

export interface IProject extends Document {
  projectName: string
  clientName: string
  description: string
}

const projectSchema = new Schema<IProject>({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true })
const Project = model("Project", projectSchema)
export default Project