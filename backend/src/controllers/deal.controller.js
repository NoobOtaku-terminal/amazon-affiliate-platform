import dealService from '../services/deal.service.js';
import { successResponse, errorResponse } from '../utils/apiHelpers.js';
import logger from '../utils/logger.js';

class DealController {
    /**
     * Create a new deal
     * POST /api/deals
     */
    async createDeal(req, res) {
        try {
            const deal = await dealService.createDeal(req.body);
            return successResponse(res, deal, 'Deal created successfully', 201);
        } catch (error) {
            logger.error('Create deal error:', error);
            return errorResponse(res, error.message, 400);
        }
    }

    /**
     * Get deal by ID
     * GET /api/deals/:id
     */
    async getDeal(req, res) {
        try {
            const deal = await dealService.getDealById(req.params.id);
            return successResponse(res, deal);
        } catch (error) {
            logger.error('Get deal error:', error);
            return errorResponse(res, error.message, 404);
        }
    }

    /**
     * Get all deals
     * GET /api/deals
     */
    async getDeals(req, res) {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                status: req.query.status || 'all',
                sortBy: req.query.sortBy || 'dealPercentage',
                sortOrder: req.query.sortOrder || 'desc',
                categoryId: req.query.categoryId,
            };

            const result = await dealService.getDeals(filters);
            return successResponse(res, result);
        } catch (error) {
            logger.error('Get deals error:', error);
            return errorResponse(res, error.message, 500);
        }
    }

    /**
     * Get hot deals (highest discounts)
     * GET /api/deals/hot
     */
    async getHotDeals(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const deals = await dealService.getHotDeals(limit);
            return successResponse(res, deals);
        } catch (error) {
            logger.error('Get hot deals error:', error);
            return errorResponse(res, error.message, 500);
        }
    }

    /**
     * Update deal
     * PUT /api/deals/:id
     */
    async updateDeal(req, res) {
        try {
            const deal = await dealService.updateDeal(req.params.id, req.body);
            return successResponse(res, deal, 'Deal updated successfully');
        } catch (error) {
            logger.error('Update deal error:', error);
            return errorResponse(res, error.message, 400);
        }
    }

    /**
     * Delete deal
     * DELETE /api/deals/:id
     */
    async deleteDeal(req, res) {
        try {
            const result = await dealService.deleteDeal(req.params.id);
            return successResponse(res, result, 'Deal deleted successfully');
        } catch (error) {
            logger.error('Delete deal error:', error);
            return errorResponse(res, error.message, 404);
        }
    }
}

export default new DealController();
