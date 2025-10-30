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
    [
        body('productIds')
            .isArray({ min: 2, max: 4 })
            .withMessage('Must provide 2-4 product IDs'),
    ],
    validate,
    comparisonController.createComparison
);

router.get('/comparisons', authenticate, comparisonController.getMyComparisons);

router.get(
    '/comparisons/:id',
    [param('id').isUUID()],
    validate,
    comparisonController.getComparison
);

router.delete(
    '/comparisons/:id',
    authenticate,
    [param('id').isUUID()],
    validate,
    comparisonController.deleteComparison
);

// Saved Products Routes
router.post(
    '/saved',
    authenticate,
    [body('productId').notEmpty().isUUID()],
    validate,
    savedProductController.saveProduct
);

router.get('/saved', authenticate, savedProductController.getSavedProducts);

router.delete(
    '/saved/:productId',
    authenticate,
    [param('productId').isUUID()],
    validate,
    savedProductController.removeSavedProduct
);

router.get(
    '/saved/check/:productId',
    authenticate,
    [param('productId').isUUID()],
    validate,
    savedProductController.checkSaved
);

export default router;
