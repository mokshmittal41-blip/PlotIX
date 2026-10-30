import { Router } from 'express';
import { propertyController } from '../controllers/propertyController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', propertyController.listProperties);

// Protected user listings (defined before /:id so 'user' is not treated as an id)
router.get('/user/my-listings', requireAuth, propertyController.getMyListings);

// Image upload
router.post('/upload-image', requireAuth, propertyController.uploadImage);

// External Listing Ingestion & Sync
router.post('/sync', propertyController.syncExternalListings);
router.get('/sync/status', propertyController.getSyncStatus);

// Single property detail
router.get('/:id', propertyController.getPropertyById);

// Protected property management
router.post('/', requireAuth, propertyController.createProperty);
router.put('/:id', requireAuth, propertyController.updateProperty);
router.delete('/:id', requireAuth, propertyController.deleteProperty);

export default router;
