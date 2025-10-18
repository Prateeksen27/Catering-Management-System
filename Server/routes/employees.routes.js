import express from 'express'
import { fetchAllEmployees,deleteEmployee, getAllEmployeesGrouped, assignStaffToProject } from '../controllers/employees.controller.js'

const router = express.Router()
router.get('/fetchEmployees',fetchAllEmployees)
router.delete('/deleteEmployee/:id',deleteEmployee)
router.get("/grouped",getAllEmployeesGrouped);
router.post("/assign",assignStaffToProject);

export default router