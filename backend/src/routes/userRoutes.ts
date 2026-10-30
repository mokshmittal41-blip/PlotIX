import { Router } from 'express';
import { getMe, getProfile, updateProfile, syncProfile } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Protected user routes (require verified Supabase JWT Bearer token)
router.get('/me', requireAuth, getMe);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.post('/sync-profile', requireAuth, syncProfile);

export default router;
