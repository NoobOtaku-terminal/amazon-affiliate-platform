import { comparisonService, savedProductService } from '../services/comparison.service.js';
import { successResponse, errorResponse } from '../utils/apiHelpers.js';
import logger from '../utils/logger.js';

// Comparison Controller
class ComparisonController {
    async createComparison(req, res) {
        try {
            const { productIds } = req.body;
            const comparison = await comparisonService.createComparison(req.user.userId, productIds);
            return successResponse(res, comparison, 'Comparison created successfully', 201);
        } catch (error) {
            logger.error('Create comparison error:', error);
            return errorResponse(res, error.message, 400);
        }
    }

    async getComparison(req, res) {
        try {
            const comparison = await comparisonService.getComparisonById(req.params.id);
            return successResponse(res, comparison);
        } catch (error) {
            logger.error('Get comparison error:', error);
            return errorResponse(res, error.message, 404);
        }
    }

    async getMyComparisons(req, res) {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
            };
            const result = await comparisonService.getUserComparisons(req.user.userId, filters);
            return successResponse(res, result);
        } catch (error) {
            logger.error('Get my comparisons error:', error);
            return errorResponse(res, error.message, 500);
        }
    }

    async deleteComparison(req, res) {
        try {
            const result = await comparisonService.deleteComparison(req.params.id, req.user.userId);
            return successResponse(res, result);
        } catch (error) {
            logger.error('Delete comparison error:', error);
            return errorResponse(res, error.message, 403);
        }
    }
}

// Saved Products Controller
class SavedProductController {
    async saveProduct(req, res) {
        try {
            const { productId } = req.body;
            const saved = await savedProductService.saveProduct(req.user.userId, productId);
            return successResponse(res, saved, 'Product saved successfully', 201);
        } catch (error) {
            logger.error('Save product error:', error);
            return errorResponse(res, error.message, 400);
        }
    }

    async getSavedProducts(req, res) {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
            };
            const result = await savedProductService.getSavedProducts(req.user.userId, filters);
            return successResponse(res, result);
        } catch (error) {
            logger.error('Get saved products error:', error);
            return errorResponse(res, error.message, 500);
        }
    }

    async removeSavedProduct(req, res) {
        try {
            const result = await savedProductService.removeSavedProduct(
                req.user.userId,
                req.params.productId
            );
            return successResponse(res, result);
        } catch (error) {
            logger.error('Remove saved product error:', error);
            return errorResponse(res, error.message, 404);
        }
    }

    async checkSaved(req, res) {
        try {
            const result = await savedProductService.isProductSaved(
                req.user.userId,
                req.params.productId
            );
            return successResponse(res, result);
        } catch (error) {
            logger.error('Check saved error:', error);
            return errorResponse(res, error.message, 500);
        }
    }
}

export const comparisonController = new ComparisonController();
export const savedProductController = new SavedProductController();
