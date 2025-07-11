import { Document, model, Schema, Types } from "mongoose"

const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed"
} as const

type TaskStatus = typeof taskStatus[keyof typeof taskStatus];

export interface ITask extends Document {
  taskName: string
  description: string
  project: Types.ObjectId
  status: TaskStatus
  completedBy: Types.ObjectId
}

const taskSchema: Schema = new Schema({
  taskName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  project: {
    type: Types.ObjectId,
    ref: "Project"
  },
  status: {
    type: String,
    enum: Object.values(taskStatus),
    default: taskStatus.PENDING
  },
  completedBy: {
    type: Types.ObjectId,
    ref: "User",
    default: null
  }
}, { timestamps: true })
const Task = model<ITask>("Task", taskSchema)
export default Task