import express from 'express'
import { getAllPendinBookings, getAllQueries,confirmBooking,getAllBookedEvents } from '../controllers/booking.controller.js'

const router = express.Router()

router.get('/getQueries',getAllQueries)
router.get('/getPendingBookings',getAllPendinBookings)
router.post('/confirmBooking',confirmBooking)
router.get('/getAllBookedEvents',getAllBookedEvents)
export default router