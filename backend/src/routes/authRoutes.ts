import { Router } from 'express';
import { signup, login, googleAuth, getAllUsers } from '../controllers/authController';

const router = Router();

// Public Authentication Endpoints
router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/users', getAllUsers);

export default router;
