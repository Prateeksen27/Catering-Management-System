import express from 'express'
import { addMenuItem, deleteMenuItem, getMenu, updateMenuItem } from '../controllers/menu.controller.js'

const router = express.Router()

router.post('/addMenuItem',addMenuItem)
router.get('/getMenu',getMenu)
router.delete('/deleteMenuItem/:id',deleteMenuItem)
router.put('/updateMenuItem/:id',updateMenuItem)

export default router
