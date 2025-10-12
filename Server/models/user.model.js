import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
      enum: ["Admin", "Manager", "Employee", "Driver"],
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
      enum: ["Active", "On-leave"],
      default: "Active",
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

EmployeeSchema.pre("save", async function (next) {

if (!this.empID) {
    const lastEmp = await this.constructor.findOne().sort({ createdAt: -1 }).exec();

    let newNumber = 1;
    if (lastEmp && lastEmp.empID) {
      const lastNumber = parseInt(lastEmp.empID.replace("EMP", ""), 10);
      newNumber = lastNumber + 1;
    }

    this.empID = `EMP${String(newNumber).padStart(3, "0")}`;
  }

  if (!this.password) {
    this.password = this.empID; // set default password
  }

  // Hash password if it’s new or modified
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
