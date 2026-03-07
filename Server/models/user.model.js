import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { generateEmployeeId } from "../utils/idGenerator.js";

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    degn: {
      type: String,
      trim: true,
      default:""
    },
    empType: {
      type: String,
      enum: ["Admin", "Manager", "Driver","Worker","Chef"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: "Phone number must be 10 digits",
      },
      default:"0000000000"
    },
    location: {
      type: String,
      trim: true,
      default:""
    },
    skills: {
      type: [String],
      trim: true,
      default: [],
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    empID: {
      type: String,
      unique: true,
      trim: true,
    },
    assignedProject: {
      type: String,
      trim: true,
      default:"N/A"
    },
    status: {
      type: String,
      enum: ["Active", "On-leave","Assigned"],
      default: "Active",
    },
    password: {
      type: String,
      minlength: 6, // Enforce minimum password length
    },
    profilePic:{
      type:String,
      default:"",
    },
  },
  { timestamps: true }
);

// Add index for frequently queried fields (only non-unique indexes)
EmployeeSchema.index({ empType: 1 });
EmployeeSchema.index({ status: 1 });

EmployeeSchema.pre("save", async function (next) {
  if (!this.empID) {
    this.empID = await generateEmployeeId();
  }

  if (!this.password) {
    // Generate a secure random password instead of using empID
    const randomPassword = Math.random().toString(36).slice(-8) + 'A1!';
    this.password = randomPassword;
  }

  // Hash password if it's new or modified
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// 🧩 Method to compare password during login
EmployeeSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
