import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeals } from '../store/slices/dealSlice';

const Deals = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.deals);

  useEffect(() => {
    dispatch(fetchDeals({ status: 'active' }));
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🔥 Hot Deals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((deal) => (
          <Link
            key={deal.id}
            to={`/products/${deal.product.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <div className="relative">
              <img
                src={deal.product.imageUrl || 'https://via.placeholder.com/400'}
                alt={deal.product.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                -{deal.dealPercentage}%
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{deal.product.title}</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-primary-600">${deal.dealPrice}</p>
                  <p className="text-sm text-gray-500 line-through">${deal.product.price}</p>
                </div>
                <div className="text-yellow-500 text-lg">★ {deal.product.rating}</div>
              </div>
              <div className="text-sm text-gray-600">
                Deal ends: {new Date(deal.endDate).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Deals;
