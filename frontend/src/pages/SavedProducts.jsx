import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSavedProducts, removeSavedProduct } from '../store/slices/userSlice';

const SavedProducts = () => {
  const dispatch = useDispatch();
  const { savedProducts } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchSavedProducts());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeSavedProduct(productId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Saved Products</h1>
      {savedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No saved products yet</p>
          <Link to="/products" className="text-primary-600 hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedProducts.map(({ product }) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/300'}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">{product.title}</h3>
                </Link>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl font-bold text-primary-600">${product.price}</p>
                  <span className="text-yellow-500">★ {product.rating}</span>
                </div>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProducts;
