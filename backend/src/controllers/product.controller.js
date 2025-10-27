import { asyncHandler } from '../utils/apiHelpers.js';
import { successResponse, buildPaginationResponse } from '../utils/apiHelpers.js';
import * as productService from '../services/product.service.js';

export const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  const response = buildPaginationResponse(result.products, result.total, result.page, result.limit);
  successResponse(res, response);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  successResponse(res, product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  successResponse(res, product, 'Product created successfully', 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  successResponse(res, product, 'Product updated successfully');
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  successResponse(res, null, 'Product deleted successfully');
});

export const getDeals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await productService.getDeals(page, limit);
  const response = buildPaginationResponse(result.products, result.total, result.page, result.limit);
  successResponse(res, response);
});

export const getNewLaunches = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await productService.getNewLaunches(page, limit);
  const response = buildPaginationResponse(result.products, result.total, result.page, result.limit);
  successResponse(res, response);
});
