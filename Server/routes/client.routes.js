import express from 'express'
import { sendBookingRequest, sendQuery } from '../controllers/client.controller.js'
const router = express.Router()
router.post('/sendQuery',sendQuery)
router.post('/sendBooking',sendBookingRequest)
export default router