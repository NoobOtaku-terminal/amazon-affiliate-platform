import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotDeals } from '../store/slices/dealSlice';
import { fetchProducts } from '../store/slices/productSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { hotDeals } = useSelector((state) => state.deals);
  const { items: products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchHotDeals());
    dispatch(fetchProducts({ limit: 8 }));
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find the Best Amazon Deals
          </h1>
          <p className="text-xl mb-8">
            Compare products, read reviews, and save money on your favorite items
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Browse Products
            </Link>
            <Link
              to="/deals"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400"
            >
              View Hot Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Hot Deals Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">🔥 Hot Deals Today</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotDeals.slice(0, 4).map((deal) => (
            <Link
              key={deal.id}
              to={`/products/${deal.product.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative">
                <img
                  src={deal.product.imageUrl || 'https://via.placeholder.com/300'}
                  alt={deal.product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                  -{deal.dealPercentage}%
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                  {deal.product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">
                      ${deal.dealPrice}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      ${deal.product.price}
                    </p>
                  </div>
                  <div className="text-yellow-500">
                    ★ {deal.product.rating}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/deals"
            className="text-primary-600 font-semibold hover:text-primary-700"
          >
            View All Deals →
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Find the lowest prices with our deal tracking system
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">Verified Reviews</h3>
              <p className="text-gray-600">
                Read authentic reviews from real customers
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔔</div>
              <h3 className="text-xl font-bold mb-2">Deal Alerts</h3>
              <p className="text-gray-600">
                Get notified when your favorite products go on sale
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Products */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Latest Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
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
                <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-primary-600">
                    ${product.price}
                  </p>
                  <div className="text-yellow-500 text-sm">
                    ★ {product.rating} ({product.reviewCount})
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
