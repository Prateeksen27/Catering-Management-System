import express from 'express'
import {
getAllPendinBookings,
getAllQueries,
confirmBooking,
getAllBookedEvents,
getAllCompletedEvents,
rejectBooking,
approveBooking,
getBookingById,
assignStaffToBooking,
assignGoodsToBooking,
assignVehiclesToBooking,
completePreparation,
updateBookingStatus,
getBookingProgress
} from '../controllers/booking.controller.js'

import { verifyToken } from '../middleware/verifyToken.js'   // ✅ ADD THIS

const router = express.Router()

// ====== STATIC ROUTES FIRST ======

// Query routes
router.get('/getQueries', verifyToken, getAllQueries)

// Pending bookings
router.get('/getPendingBookings', verifyToken, getAllPendinBookings)

// Legacy routes
router.post('/confirmBooking', verifyToken, confirmBooking)
router.get('/getAllBookedEvents', verifyToken, getAllBookedEvents)
router.get('/getCompletedBookings', verifyToken, getAllCompletedEvents)

// ====== POST ROUTES ======
router.post('/reject', verifyToken, rejectBooking)
router.post('/approve', verifyToken, approveBooking)

// ====== PUT ROUTES WITH ID ======
router.put('/:id/assign-staff', verifyToken, assignStaffToBooking)
router.put('/:id/assign-goods', verifyToken, assignGoodsToBooking)
router.put('/:id/assign-vehicles', verifyToken, assignVehiclesToBooking)

// ====== POST ROUTES WITH ID ======
router.post('/:id/complete-preparation', verifyToken, completePreparation)

// ====== PATCH ROUTES ======
router.patch('/:id/status', verifyToken, updateBookingStatus)

// ====== GET ROUTES WITH ID ======
router.get('/:id/progress', verifyToken, getBookingProgress)

// ====== DYNAMIC ROUTE LAST ======
router.get('/:id', verifyToken, getBookingById)

export default router
