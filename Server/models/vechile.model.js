import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    plateNumber: { type: String, required: true, unique: true, trim: true },
    model: { type: String, required: true, trim: true, default: '' },
    capacity: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['available', 'assigned', 'maintenance'], default: 'available' },
    manufacturer: { type: String, trim: true, default: '' },
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Other'], default: 'Diesel' },
    notes: { type: String, trim: true, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

vehicleSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

vehicleSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

export default mongoose.model('Vehicle', vehicleSchema);
