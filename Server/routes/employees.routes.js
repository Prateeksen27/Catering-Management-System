import express from 'express'
import { fetchAllEmployees } from '../controllers/employees.controller.js'

const router = express.Router()
router.get('/fetchEmployees',fetchAllEmployees)

export default router