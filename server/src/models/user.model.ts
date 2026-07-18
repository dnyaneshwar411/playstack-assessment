import { model, Schema, type InferRawDocTypeFromSchema } from "mongoose";
import { ROLES, USER_STATUSES } from "../config/constants.js";

const userSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: Number,
  },
  password: {
    type: String,
    trim: true,
    select: false
  },
  employeeId: {
    type: String,
  },
  reportingManager: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  role: {
    type: String,
    enum: ROLES,
    required: true
  },
  department: {
    type: String,
    // enum: ROLES,
    required: true
  },
  designation: {
    type: String,
    trim: true
  },
  salary: {
    type: Number
  },
  status: {
    type: String,
    enum: USER_STATUSES,
    required: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  avatar: { // supposed to be s3 key, also other meta can be added like upload file name.
    private: {
      type: Boolean,
      default: false
    },
    key: {
      type: String,
      required: true
    }
  }
}, { timestamps: true });

const User = model("User", userSchema);

export default User;

export type IUser = InferRawDocTypeFromSchema<typeof userSchema>;