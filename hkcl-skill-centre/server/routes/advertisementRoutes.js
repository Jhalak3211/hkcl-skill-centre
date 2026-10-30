import { Router } from 'express';
import {
  getPublishedAdvertisements,
  getAllAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} from '../controllers/advertisementController.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = Router();

// Public: Published advertisements for homepage
router.get('/published', getPublishedAdvertisements);

// Protected: Admin-only CRUD
router.use(requireAdminAuth);

router.get('/', getAllAdvertisements);
router.post('/', createAdvertisement);
router.put('/:id', updateAdvertisement);
router.delete('/:id', deleteAdvertisement);

export default router;
