import express from 'express';
import dealController from '../controllers/deal.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import {
    createDealValidation,
    updateDealValidation,
    getDealValidation,
    getDealsValidation,
    deleteDealValidation,
} from '../validations/deal.validation.js';

const router = express.Router();

/**
 * Public Routes
 */
// Get all deals
router.get('/', validate(getDealsValidation), dealController.getDeals);

// Get hot deals
router.get('/hot', dealController.getHotDeals);

// Get deal by ID
router.get('/:id', validate(getDealValidation), dealController.getDeal);

/**
 * Protected Routes (Admin Only)
 */
// Create deal
router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate(createDealValidation),
    dealController.createDeal
);

// Update deal
router.put(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(updateDealValidation),
    dealController.updateDeal
);

// Delete deal
router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(deleteDealValidation),
    dealController.deleteDeal
);

export default router;
