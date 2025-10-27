import prisma from '../config/database.js';
import { ApiError } from '../utils/apiHelpers.js';
import { paginate } from '../utils/apiHelpers.js';

export const getAllProducts = async (filters) => {
    const { page = 1, limit = 20, category, minPrice, maxPrice, minRating, search, sort = 'newest' } = filters;
    const { skip, take } = paginate(page, limit);

    const where = { isActive: true };

    if (category) where.categoryId = category;
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice);
        if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { brand: { contains: search, mode: 'insensitive' } },
        ];
    }

    let orderBy = {};
    switch (sort) {
        case 'price_asc': orderBy = { price: 'asc' }; break;
        case 'price_desc': orderBy = { price: 'desc' }; break;
        case 'rating': orderBy = { rating: 'desc' }; break;
        case 'popular': orderBy = { reviewCount: 'desc' }; break;
        default: orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
                category: { select: { id: true, name: true, slug: true } },
                _count: { select: { reviews: true } },
            },
        }),
        prisma.product.count({ where }),
    ]);

    return { products, total, page: parseInt(page), limit: parseInt(limit) };
};

export const getProductById = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            reviews: {
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { id: true, name: true } } },
            },
            _count: { select: { reviews: true } },
        },
    });

    if (!product) throw new ApiError(404, 'Product not found');
    return product;
};

export const createProduct = async (productData) => {
    const exists = await prisma.product.findUnique({ where: { asin: productData.asin } });
    if (exists) throw new ApiError(409, 'Product with this ASIN already exists');

    return await prisma.product.create({
        data: productData,
        include: { category: true },
    });
};

export const updateProduct = async (id, updateData) => {
    return await prisma.product.update({
        where: { id },
        data: updateData,
        include: { category: true },
    });
};

export const deleteProduct = async (id) => {
    return await prisma.product.delete({ where: { id } });
};

export const getDeals = async (page = 1, limit = 20) => {
    const { skip, take } = paginate(page, limit);

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where: {
                isDeal: true,
                isActive: true,
                dealExpiry: { gt: new Date() },
            },
            skip,
            take,
            orderBy: { discountPercent: 'desc' },
            include: { category: { select: { name: true, slug: true } } },
        }),
        prisma.product.count({
            where: { isDeal: true, isActive: true, dealExpiry: { gt: new Date() } },
        }),
    ]);

    return { products, total, page: parseInt(page), limit: parseInt(limit) };
};

export const getNewLaunches = async (page = 1, limit = 20) => {
    const { skip, take } = paginate(page, limit);

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where: { isNewLaunch: true, isActive: true },
            skip,
            take,
            orderBy: { launchDate: 'desc' },
            include: { category: { select: { name: true, slug: true } } },
        }),
        prisma.product.count({ where: { isNewLaunch: true, isActive: true } }),
    ]);

    return { products, total, page: parseInt(page), limit: parseInt(limit) };
};
