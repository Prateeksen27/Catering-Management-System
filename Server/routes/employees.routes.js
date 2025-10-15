import express from 'express'
import { fetchAllEmployees,deleteEmployee } from '../controllers/employees.controller.js'

const router = express.Router()
router.get('/fetchEmployees',fetchAllEmployees)
router.delete('/deleteEmployee/:id',deleteEmployee)

export default router