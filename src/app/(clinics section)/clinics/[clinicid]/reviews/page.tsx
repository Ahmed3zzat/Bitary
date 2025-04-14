'use client';

import Image from 'next/image';
import { FaQuoteLeft, FaStar, FaRegStar, FaPlus } from 'react-icons/fa';
import { useState } from 'react';

// Fake review data
const reviews = [
  {
    name: 'Haylie Aminoff',
    time: 'Just now',
    text: 'The thing I like best about him is the amount of time it has saved while trying to chat with my three pets. The AI understands their different personalities perfectly!',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4
  },
  {
    name: 'Carla Septimus',
    time: '32 minutes ago',
    text: 'Never thought I would be having meaningful conversations with my cat. him surprised me with how accurate the translations seem based on his reactions!',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 5
  },
  {
    name: 'Carla George',
    time: '2 days ago',
    text: 'My parrot now has more interesting things to say than most people I know. Thanks to him, we have proper conversations every morning over breakfast.',
    img: 'https://randomuser.me/api/portraits/women/66.jpg',
    rating: 5
  },
  {
    name: 'Marcus Chen',
    time: '1 week ago',
    text: 'The barking translation feature helped me understand why my dog was anxious during storms. We\'ve worked through his fear together thanks to these insights.',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4
  },
];

export default function Reviews() {
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Mock user data
  const currentUser = {
    name: 'You',
    img: 'https://randomuser.me/api/portraits/women/10.jpg',
  };

  const handleAddReview = () => {
    console.log('Review submitted:', { text: reviewText, rating });
    setReviewText('');
    setRating(0);
    setIsAddingReview(false);
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-gray-50 py-5 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Customer Reviews</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear what pet lovers like you are saying about their experience
          </p>
        </div>

        {/* Ratings Summary */}
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row gap-8 items-start border border-green-100">
          {/* Rating Block */}
          <div className="md:w-1/3 space-y-6 text-center md:text-left">
            <div className="bg-green-100 inline-flex items-center justify-center p-4 rounded-full">
              <div className="relative">
                <h2 className="text-6xl font-extrabold text-green-700">4.9</h2>
                <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      i < 4 ? <FaStar key={i} className="text-yellow-400 text-sm" /> : <FaRegStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-lg">Based on 5,000+ authentic reviews</p>

            <div className="space-y-3 mt-6">
              {[5, 4, 3, 2, 1].map((stars) => {
                const percentage = stars === 5 ? '95%' : stars === 4 ? '5%' : '0%';
                return (
                  <div key={stars} className="flex items-center">
                    <span className="text-gray-600 w-8">{stars}</span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-yellow-400 h-2.5 rounded-full" 
                          style={{ width: percentage }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">{percentage}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highlighted Review */}
          <div className="relative flex-1 w-full">
            <div className="absolute -top-4 -right-4">
              <button 
                onClick={() => setIsAddingReview(!isAddingReview)}
                className="bg-green-600 hover:bg-green-700 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold hover:scale-110 transition-all shadow-lg"
              >
                {isAddingReview ? (
                  <span className="text-2xl">×</span>
                ) : (
                  <FaPlus className="text-xl" />
                )}
              </button>
            </div>
            
            {isAddingReview ? (
              <div className="bg-white p-6 rounded-2xl border-2 border-green-200 shadow-md space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={currentUser.img}
                      alt={`${currentUser.name} avatar`}
                      className="rounded-full object-cover ring-2 ring-green-500"
                      width={56}
                      height={56}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg">{currentUser.name}</h4>
                </div>
                
                <div className="flex gap-1 text-3xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      {star <= (hoverRating || rating) ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
                    rows={5}
                  />
                </div>
                
                <div className="flex justify-end gap-4">
                  <button 
                    onClick={() => setIsAddingReview(false)}
                    className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddReview}
                    disabled={!reviewText || rating === 0}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                      reviewText && rating > 0 
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Share Your Story
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-inner border border-green-100 h-full">
                <div className="flex items-center gap-3 text-yellow-400 text-2xl mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <div className="relative pl-12">
                  <FaQuoteLeft className="absolute left-0 top-0 text-green-300 text-3xl opacity-70" />
                  <p className="text-gray-700 text-lg leading-relaxed italic font-medium">
                    &quot;He transformed how I communicate with my rescue dog. After years of guessing his needs, I finally understand his anxiety triggers and can comfort him properly. The translation accuracy is uncanny - he responds exactly as predicted when I the suggested phrases!&quot;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <Image
                      src="https://randomuser.me/api/portraits/women/28.jpg"
                      alt="Reviewer avatar"
                      className="rounded-full object-cover"
                      width={48}
                      height={48}
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                      <p className="text-sm text-gray-500">Verified Pet Parent</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Grid */}
        {!isAddingReview && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-2xl shadow-lg p-6 flex gap-5 items-start hover:shadow-xl transition-all duration-300 border border-transparent hover:border-green-100"
                >
                  <div className="relative">
                    <Image
                      src={review.img}
                      alt={`${review.name} avatar`}
                      className="rounded-full object-cover ring-2 ring-green-200"
                      width={56}
                      height={56}
                    />
                    {review.rating === 5 && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <p className="text-xs text-gray-400">{review.time}</p>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          i < review.rating ? <FaStar key={i} className="text-sm" /> : <FaRegStar key={i} className="text-sm" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Review Button */}
            <div className="text-center pt-4">
              <button 
                onClick={() => setIsAddingReview(true)}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <FaPlus />
                Share Your Experience
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}