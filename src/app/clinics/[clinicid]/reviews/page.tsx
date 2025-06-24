"use client";
import {
  FaQuoteLeft,
  FaStar,
  FaRegStar,
  FaPlus,
  FaUser,
  FaTrash,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import {
  createRating,
  deleteRate,
  getRateByIdClinic,
  getRateCheckById,
} from "@/store/Features/rating.slice";
import { format } from "date-fns";
import { fetchUserData } from "@/store/Features/profile.slice";

export default function Reviews() {
  const dispatch = useAppDispatch();
  const { clinicid } = useParams();
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ID, setID] = useState<number>(Number(clinicid));
  const { reviewIdClinic, checker } = useAppSelector(
    (state) => state.SliceofRating
  );
  const { user } = useAppSelector((state) => state.profileSlice);
  const myRole = useAppSelector((state) => state.userSlice.user);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const currentUser = {
    name: user?.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : "You",
  };

  useEffect(() => {
    if (clinicid) {
      setID(Number(clinicid));
      dispatch(getRateByIdClinic(Number(clinicid)));
    }
  }, [clinicid, dispatch]);

  useEffect(() => {
    dispatch(getRateCheckById(Number(clinicid)));
  }, [dispatch, clinicid]);

  const averageRating =
    reviewIdClinic.length > 0
      ? reviewIdClinic.reduce((sum, review) => sum + review.ratingValue, 0) /
        reviewIdClinic.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviewIdClinic.filter(
      (review) => Math.round(review.ratingValue) === stars
    ).length;
    const percentage =
      reviewIdClinic.length > 0
        ? Math.round((count / reviewIdClinic.length) * 100)
        : 0;
    return { stars, count, percentage };
  });

  const handleAddReview = async () => {
    if (!reviewText || rating === 0) return;

    try {
      await dispatch(
        createRating({
          clinicId: ID,
          ratingValue: rating,
          comment: reviewText,
        })
      ).unwrap();

      setReviewText("");
      setRating(0);
      setIsAddingReview(false);
      await dispatch(getRateByIdClinic(ID));
      dispatch(getRateCheckById(ID));
    } catch (error) {
      console.error("Failed to create rating:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-gray-50 py-12 min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-800 mb-3">
            Customer Reviews
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear what pet lovers like you are saying about their experience
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-10 items-start border border-green-100">
          <div className="md:w-1/3 space-y-6 text-center md:text-left">
            <div className="relative bg-gradient-to-br from-green-100 to-green-50 inline-flex flex-col items-center justify-center p-6 rounded-2xl shadow-inner w-full">
              <h2 className="text-7xl font-extrabold text-green-700 mb-2">
                {averageRating.toFixed(1)}
              </h2>
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) =>
                  i < Math.round(averageRating) ? (
                    <FaStar key={i} className="text-yellow-400 text-xl mx-0.5" />
                  ) : (
                    <FaRegStar key={i} className="text-yellow-400 text-xl mx-0.5" />
                  )
                )}
              </div>
              <p className="text-gray-600 text-lg font-medium">
                {reviewIdClinic.length} review{reviewIdClinic.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-4 mt-6">
              {ratingDistribution.map(({ stars, percentage }) => (
                <div key={stars} className="flex items-center">
                  <div className="flex items-center w-10">
                    <span className="text-gray-700 font-medium">{stars}</span>
                    <FaStar className="text-yellow-400 ml-1 text-sm" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-yellow-400 h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-600 text-sm font-medium w-12">
                    {percentage}%
                  </span>
                </div>
              ))}
            </div>

            {!checker && myRole === "0" && (
              <button
                onClick={() => setIsAddingReview(true)}
                className={`mt-8 w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isAddingReview
                    ? "bg-gray-200 text-gray-600"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                <FaPlus />
                {isAddingReview ? "Editing Review" : "Write a Review"}
              </button>
            )}
          </div>

          <div className="relative flex-1 w-full space-y-8">
            {isAddingReview ? (
              <div className="bg-white p-8 rounded-2xl border-2 border-green-200 shadow-lg space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 text-green-800 rounded-full w-14 h-14 flex items-center justify-center shadow-sm">
                    <FaUser className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {currentUser.name}
                    </h4>
                    <p className="text-gray-500 text-sm">Share your experience</p>
                  </div>
                </div>

                <div className="flex gap-1 text-3xl mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-all transform hover:scale-110 hover:text-yellow-500"
                    >
                      {star <= (hoverRating || rating) ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-yellow-400" />
                      )}
                    </button>
                  ))}
                  <span className="ml-3 text-gray-600 font-medium text-lg self-center">
                    {rating > 0 ? `${rating} star${rating !== 1 ? "s" : ""}` : "Select rating"}
                  </span>
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all"
                  rows={5}
                  placeholder="Share details of your experience at this clinic..."
                />

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsAddingReview(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddReview}
                    disabled={!reviewText || rating === 0}
                    className={`px-8 py-3 rounded-lg font-bold transition-all ${
                      reviewText && rating > 0
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Post Review
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {reviewIdClinic.length > 0 ? (
                  reviewIdClinic.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:border-green-200 transition-all relative group hover:shadow-lg"
                    >
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {myRole === "2" && (
                          <button
                            onClick={async () => {
                              try {
                                await dispatch(deleteRate(review.id)).unwrap();
                                dispatch(getRateByIdClinic(Number(clinicid)));
                              } catch (error) {
                                console.error("Error deleting rate:", error);
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete review"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        )}
                      </div>

                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
                            <FaUser className="text-lg" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review.userName}
                            </h4>
                            <div className="flex items-center gap-1 text-yellow-400">
                              {[...Array(5)].map((_, i) =>
                                i < Math.round(review.ratingValue) ? (
                                  <FaStar key={i} className="text-sm" />
                                ) : (
                                  <FaRegStar key={i} className="text-sm" />
                                )
                              )}
                              <span className="text-gray-500 text-xs ml-1">
                                ({review.ratingValue.toFixed(1)})
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 px-3 py-1 rounded-lg bg-green-50">
                          {format(new Date(review.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="relative pl-10">
                        <FaQuoteLeft className="absolute left-0 top-0 text-green-300 text-2xl opacity-70" />
              <p className="text-gray-700 leading-relaxed break-all whitespace-normal truncate hover:whitespace-normal">
  {review.comment}
</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-10 shadow-inner border-2 border-dashed border-green-200 h-full text-center flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center gap-2 text-yellow-400 text-3xl mb-5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <div className="relative px-12">
                      <FaQuoteLeft className="absolute left-4 top-0 text-green-300 text-4xl opacity-50" />
                      <h3 className="text-2xl font-bold text-gray-700 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        Be the first to share your experience with this clinic!
                      </p>
                      {!checker && myRole === "0" && (
                        <button
                          onClick={() => setIsAddingReview(true)}
                          className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2 mx-auto"
                        >
                          <FaPlus />
                          Write First Review
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}