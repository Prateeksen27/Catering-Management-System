import express from 'express';
import { login, register ,updateProfile } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();
router.post('/login',login)
router.post('/register',register)
router.put("/update-profile/:id", updateProfile)

export default router;