import express from 'express'
import { getAllPendinBookings, getAllQueries,confirmBooking,getAllBookedEvents, getAllCompleted, completeBooking, updateStatusAndDeposit, } from '../controllers/booking.controller.js'

const router = express.Router()

router.get('/getQueries',getAllQueries)
router.get('/getPendingBookings',getAllPendinBookings)
router.post('/confirmBooking',confirmBooking)
router.get('/getAllBookedEvents',getAllBookedEvents)
router.get('/getCompletedBookings',getAllCompleted)
router.post('/completeBooking',completeBooking)
router.patch('/updateStatus/:id',updateStatusAndDeposit)
export default router