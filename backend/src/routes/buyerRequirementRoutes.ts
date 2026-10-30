import { Router } from 'express';
import { buyerRequirementController } from '../controllers/buyerRequirementController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Public list
router.get('/', buyerRequirementController.listRequirements);

// Protected my-requirements
router.get('/my-requirements', requireAuth, buyerRequirementController.getMyRequirements);

// Create requirement (optional auth)
router.post('/', (req, res, next) => {
  // Try requireAuth if header is present, else continue as guest
  if (req.headers.authorization) {
    return requireAuth(req, res, next);
  }
  next();
}, buyerRequirementController.createRequirement);

// Delete requirement
router.delete('/:id', requireAuth, buyerRequirementController.deleteRequirement);

export default router;
