import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/user.auth.js'
import clientRoutes from './routes/client.routes.js'
import bookingRoutes from './routes/booking.routes.js'
import employeeRoutes from './routes/employees.routes.js'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
dotenv.config();

const app = express();
app.use(cors({
  origin: ["http://localhost:8080","http://localhost:5173","http://localhost:8081"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth',authRoutes);
app.use('/api/client',clientRoutes)
app.use('/api/booking',bookingRoutes)
app.use('/api/employees',employeeRoutes)
mongoose.connect(process.env.URI).then(()=>{
  console.log("Connected to MongoDB");
})
app.get('/', (req, res) => {
  res.send('Welcome to the CMS Server');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});