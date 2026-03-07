import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/user.auth.js'
import clientRoutes from './routes/client.routes.js'
import bookingRoutes from './routes/booking.routes.js'
import employeeRoutes from './routes/employees.routes.js'
import menuRoutes from './routes/menu.routes.js'
import storeRoutes from './routes/store.routes.js'
import vehicleRoutes from './routes/vehicle.route.js'
import inventoryRoutes from './routes/inventory.routes.js'
import ticketRoutes from './routes/ticket.routes.js'
import chefRequirementRoutes from './routes/chefRequirement.routes.js'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { initializeCounters } from './utils/idGenerator.js';

// Create uploads directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads/requirements');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}
dotenv.config();

// Parse allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ["http://localhost:8080", "http://localhost:5173", "http://localhost:8081"];

const app = express();

// Rate limiting configuration
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs for auth
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);
app.use('/api/auth', authLimiter);
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));   // ✅ Increase JSON body limit
app.use(express.urlencoded({ limit: '10mb', extended: true })); // ✅ For form data
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth',authRoutes);
app.use('/api/client',clientRoutes)
app.use('/api/booking',bookingRoutes)
app.use('/api/employees',employeeRoutes)
app.use("/api/menu",menuRoutes)
app.use("/api/store",storeRoutes)
app.use("/api/vehicle",vehicleRoutes)
app.use('/api/inventory',inventoryRoutes)
app.use('/api/tickets',ticketRoutes)
app.use('/api/chef-requirements', chefRequirementRoutes)
mongoose.connect(process.env.MONGO_URI || process.env.URI).then(()=>{
  console.log("Connected to MongoDB");
  initializeCounters(); // Initialize ID counters from existing data
})
app.get('/', (req, res) => {
  res.send('Welcome to the CMS Server');
});
const PORT = process.env.PORT || 5000;

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});