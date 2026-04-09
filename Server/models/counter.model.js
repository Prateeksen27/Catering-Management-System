import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
}, { _id: false }); // Disable default _id index since we use custom _id

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
