import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        trim: true
    },
    priority:{
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    deadline:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    assignedTo:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    isActive:{
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)
export default Task