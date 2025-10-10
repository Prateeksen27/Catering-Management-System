import express from 'express'
import { createStoreItem, deleteStoreItem, getAllStoreItems, updateStock, updateStoreItem } from '../controllers/store.controller.js'

const router = express.Router()

router.post('/createNewItem',createStoreItem)
router.get('/getAllItems',getAllStoreItems)
router.put('/updateItem/:id',updateStoreItem)
router.put('/updateStock/:id',updateStock)
router.delete('/delete/:id',deleteStoreItem)
export default router