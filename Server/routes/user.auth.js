import express from 'express';
import { login, register, updateProfile, updateProfilePic } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();
router.post('/login',login)
router.post('/register',register)
router.put("/update-profile/:id", updateProfile)
router.put("/update-profilePic/:id", updateProfilePic)

export default router;