import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Sample reviews data
const sampleReviews = [
  {
    id: 1,
    productId: 101,
    productName: 'Premium Slim Fit Suit',
    productImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 5,
    title: 'Excellent Quality!',
    comment: 'This suit fits perfectly and the material is high quality. Would definitely recommend to others looking for a formal suit.',
    date: '2023-10-15',
    helpful: 12,
    verified: true
  },
  {
    id: 2,
    productId: 102,
    productName: 'Classic Wool Blazer',
    productImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 4,
    title: 'Good blazer, runs slightly large',
    comment: 'The material is nice and it looks great, but I found it runs a bit large. Would suggest sizing down.',
    date: '2023-10-10',
    helpful: 5,
    verified: true
  },
  {
    id: 3,
    productId: 103,
    productName: 'Cotton Dress Shirt',
    productImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    rating: 3,
    title: 'Average shirt',
    comment: 'The shirt is okay for the price, but the fabric is thinner than I expected. Might not hold up well after multiple washes.',
    date: '2023-10-05',
    helpful: 2,
    verified: false
  }
];

const MyReviews = () => {
  const [reviews, setReviews] = useState(sampleReviews);
  const [editingId, setEditingId] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [editForm, setEditForm] = useState({
    rating: 0,
    title: '',
    comment: ''
  });

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date) - new Date(a.date);
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  // Filter reviews based on rating
  const filteredReviews = sortedReviews.filter(review => {
    if (filterBy === 'all') return true;
    return review.rating === parseInt(filterBy);
  });

  const handleEditReview = (review) => {
    setEditingId(review.id);
    setEditForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      rating: 0,
      title: '',
      comment: ''
    });
  };

  const handleSaveEdit = (id) => {
    const updatedReviews = reviews.map(review =>
      review.id === id
        ? { ...review, ...editForm, date: new Date().toISOString().split('T')[0] }
        : review
    );
    setReviews(updatedReviews);
    setEditingId(null);
  };

  const handleDeleteReview = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(review => review.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleRatingChange = (newRating) => {
    setEditForm({
      ...editForm,
      rating: newRating
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full">
      <div className="flex flex-col mb-6">
        <h2 className="font-marcellus text-2xl sm:text-3xl text-slate-900 mb-2">My Reviews</h2>
        <p className="text-slate-600 text-sm sm:text-base">
          {totalReviews} review{totalReviews !== 1 ? 's' : ''} • Average: {averageRating.toFixed(1)}/5
        </p>
      </div>
      
      {/* Sort and Filter Controls - Stacked on mobile */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <label htmlFor="sort" className="block text-slate-700 text-sm mb-1">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-40 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="recent">Most Recent</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
        
        <div className="w-full sm:w-auto">
          <label htmlFor="filter" className="block text-slate-700 text-sm mb-1">Filter by:</label>
          <select
            id="filter"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="w-full sm:w-40 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-10 sm:py-16">
          <div className="text-slate-300 text-5xl sm:text-6xl mb-4">⭐</div>
          <h3 className="text-lg sm:text-xl text-slate-700 mb-2">You haven't written any reviews yet</h3>
          <p className="text-slate-500 text-sm sm:text-base mb-6">Share your thoughts on products you've purchased to help other shoppers.</p>
          <Link
            to="/products"
            className="inline-block bg-slate-900 text-white py-2 px-5 sm:py-3 sm:px-6 rounded-md hover:bg-slate-700 transition text-sm uppercase tracking-widest"
          >
            Browse Products
          </Link>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-10 sm:py-16">
          <div className="text-slate-300 text-5xl sm:text-6xl mb-4">🔍</div>
          <h3 className="text-lg sm:text-xl text-slate-700 mb-2">No reviews match your filter</h3>
          <p className="text-slate-500 text-sm sm:text-base mb-6">Try changing your filter settings to see your reviews.</p>
          <button
            onClick={() => setFilterBy('all')}
            className="inline-block bg-slate-900 text-white py-2 px-5 sm:py-3 sm:px-6 rounded-md hover:bg-slate-700 transition text-sm uppercase tracking-widest"
          >
            Show All Reviews
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="border border-slate-200 rounded-lg p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0 self-center sm:self-start">
                  <Link to={`/product/${review.productId}`}>
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                    />
                  </Link>
                </div>
                
                {/* Review Content */}
                <div className="flex-grow">
                  <Link to={`/product/${review.productId}`} className="font-medium text-slate-900 hover:text-slate-700 text-base sm:text-lg">
                    {review.productName}
                  </Link>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center mt-1 mb-2 gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= review.rating ? 'text-amber-500' : 'text-slate-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {review.verified && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded self-start">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-slate-900 text-base sm:text-lg mb-1">{review.title}</h4>
                  <p className="text-slate-600 text-sm sm:text-base mb-3">{review.comment}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs sm:text-sm text-slate-500">
                      <span>Reviewed on {formatDate(review.date)}</span>
                      {review.helpful > 0 && (
                        <span className="ml-0 sm:ml-3 block sm:inline-block mt-1 sm:mt-0">
                          {review.helpful} people found this helpful
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-3 mt-2 sm:mt-0">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-slate-900 hover:text-slate-700 text-xs sm:text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Edit Form */}
              {editingId === review.id && (
                <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-3 text-base sm:text-lg">Edit Your Review</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none"
                        >
                          <svg
                            className={`w-6 h-6 sm:w-8 sm:h-8 ${star <= editForm.rating ? 'text-amber-500' : 'text-slate-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Review Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editForm.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Enter a title for your review"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-1">Your Review</label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={editForm.comment}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Share your experience with this product"
                    ></textarea>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleSaveEdit(review.id)}
                      className="bg-slate-900 text-white py-2 px-4 sm:px-5 rounded-md hover:bg-slate-700 transition text-sm flex-1 sm:flex-none"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-white text-slate-900 py-2 px-4 sm:px-5 rounded-md border border-slate-900 hover:bg-slate-100 transition text-sm flex-1 sm:flex-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;