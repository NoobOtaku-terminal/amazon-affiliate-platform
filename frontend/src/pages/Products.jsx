import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({ page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' });

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          className="px-4 py-2 border rounded-md"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
        <select
          className="px-4 py-2 border rounded-md"
          value={filters.sortOrder}
          onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={product.imageUrl || 'https://via.placeholder.com/300'}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">{product.title}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-primary-600">${product.price}</p>
                  <span className="text-yellow-500">★ {product.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
