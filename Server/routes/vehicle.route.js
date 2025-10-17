import express from 'express'
import { createVehicle, deleteVehicle, getVehicle, listVehicles, updateVehicle } from '../controllers/vehicle.controller.js'

const router = express.Router()


router.get('/getVehicles', listVehicles);
router.get('/getVehicle/:id', getVehicle);
router.post('/createVehicle', createVehicle);
router.put('/updateVehicle/:id', updateVehicle);
router.delete('/deleteVehicle/:id', deleteVehicle)


export default router;