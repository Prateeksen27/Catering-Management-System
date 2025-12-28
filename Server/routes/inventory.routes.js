import express from 'express';
import { createInventoryItem, getInventoryItems, updateInventoryItem, updateInventoryStock } from '../controllers/inventory.controller.js';
const router = express.Router();

router.get('/',getInventoryItems);
router.post('/',createInventoryItem);
router.put('/:id',updateInventoryItem);
router.patch('/stock/:id',updateInventoryStock);
export default router;