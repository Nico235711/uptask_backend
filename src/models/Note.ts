import { Document, model, PopulatedDoc, Schema, Types } from "mongoose"
import { ITask } from "./Task"
import { IUser } from "./User"

export interface INote extends Document {
  createdBy: Types.ObjectId,
  content: string
  task: Types.ObjectId
}

const noteSchema: Schema = new Schema({
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  task: {
    type: Types.ObjectId,
    ref: "Task",
    required: true,
  },
}, { timestamps: true })
const Note = model<INote>("Note", noteSchema)
export default Note