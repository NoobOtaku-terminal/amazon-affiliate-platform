import express from 'express';
import { comparisonController, savedProductController } from '../controllers/comparison.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validator.middleware.js';

const router = express.Router();

// Comparison Routes
router.post(
    '/comparisons',
    authenticate,
    validate([
        body('productIds')
            .isArray({ min: 2, max: 4 })
            .withMessage('Must provide 2-4 product IDs'),
    ]),
    comparisonController.createComparison
);

router.get('/comparisons', authenticate, comparisonController.getMyComparisons);

router.get(
    '/comparisons/:id',
    validate([param('id').isUUID()]),
    comparisonController.getComparison
);

router.delete(
    '/comparisons/:id',
    authenticate,
    validate([param('id').isUUID()]),
    comparisonController.deleteComparison
);

// Saved Products Routes
router.post(
    '/saved',
    authenticate,
    validate([body('productId').notEmpty().isUUID()]),
    savedProductController.saveProduct
);

router.get('/saved', authenticate, savedProductController.getSavedProducts);

router.delete(
    '/saved/:productId',
    authenticate,
    validate([param('productId').isUUID()]),
    savedProductController.removeSavedProduct
);

router.get(
    '/saved/check/:productId',
    authenticate,
    validate([param('productId').isUUID()]),
    savedProductController.checkSaved
);

export default router;
