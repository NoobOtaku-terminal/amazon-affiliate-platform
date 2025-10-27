import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/slices/productSlice';
import { fetchProductReviews } from '../store/slices/reviewSlice';
import { saveProduct } from '../store/slices/userSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct } = useSelector((state) => state.products);
  const { items: reviews, ratingStats } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProductReviews({ productId: id }));
  }, [dispatch, id]);

  const handleSave = () => {
    dispatch(saveProduct(id));
  };

  if (!currentProduct) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img
            src={currentProduct.imageUrl || 'https://via.placeholder.com/500'}
            alt={currentProduct.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{currentProduct.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary-600">${currentProduct.price}</span>
            <span className="text-yellow-500 text-xl">★ {currentProduct.rating}</span>
            <span className="text-gray-600">({currentProduct.reviewCount} reviews)</span>
          </div>
          <p className="text-gray-700 mb-6">{currentProduct.description}</p>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700"
            >
              Save Product
            </button>
            <a
              href={currentProduct.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-orange-500 text-white py-3 rounded-md text-center hover:bg-orange-600"
            >
              Buy on Amazon
            </a>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {ratingStats && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="text-4xl font-bold text-center">{ratingStats.average}</div>
            <div className="text-center text-gray-600">{ratingStats.total} reviews</div>
          </div>
        )}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{review.user.name}</span>
                <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
              </div>
              <h3 className="font-semibold mb-2">{review.title}</h3>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
