import { Document, model, Schema } from "mongoose"

export interface IUser extends Document {
  email: string
  password: string
  name: string
  confirmed: boolean
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  confirmed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })
const User = model<IUser>("User", userSchema)
export default User