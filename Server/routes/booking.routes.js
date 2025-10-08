import express from 'express'
import { getAllPendinBookings, getAllQueries } from '../controllers/booking.controller.js'

const router = express.Router()

router.get('/getQueries',getAllQueries)
router.get('/getPendingBookings',getAllPendinBookings)
export default router