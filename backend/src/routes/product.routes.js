import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { authenticate, authorize, optionalAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { readLimiter, writeLimiter } from '../middlewares/rateLimiter.middleware.js';
import { createProductValidation, updateProductValidation, productQueryValidation } from '../validations/product.validation.js';

const router = express.Router();

// Public routes
router.get('/', readLimiter, productQueryValidation, validate, productController.getAllProducts);
router.get('/deals', readLimiter, productController.getDeals);
router.get('/new-launches', readLimiter, productController.getNewLaunches);
router.get('/:id', readLimiter, productController.getProductById);

// Admin routes
router.post('/', authenticate, authorize('ADMIN'), writeLimiter, createProductValidation, validate, productController.createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), writeLimiter, updateProductValidation, validate, productController.updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), productController.deleteProduct);

export default router;
