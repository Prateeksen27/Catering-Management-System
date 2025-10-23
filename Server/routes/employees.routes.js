import express from 'express'
import { fetchAllEmployees,deleteEmployee, getAllEmployeesGrouped, assignStaffToProject, getAllAssignedEvents } from '../controllers/employees.controller.js'

const router = express.Router()
router.get('/fetchEmployees',fetchAllEmployees)
router.delete('/deleteEmployee/:id',deleteEmployee)
router.get("/grouped",getAllEmployeesGrouped);
router.post("/assign",assignStaffToProject);
router.get('/:id/events',getAllAssignedEvents)


export default router