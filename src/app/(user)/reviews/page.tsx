"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import {
  deleteRate,
  getRateById,
  getUserRates,
  updateRate,
} from "@/store/Features/rating.slice";
import {
  MdEdit,
  MdDelete,
  MdExpandMore,
  MdExpandLess,
  MdClose,
  MdCheck,
  MdArrowBack,
} from "react-icons/md";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/Components/Loading/loading";
import { ClinicReviews, RateData } from "@/types/rating.type";
import Link from "next/link";

export default function Reviews() {
  const dispatch = useAppDispatch();
  const { isError, reviewUserClinic, isLoading, ratingDetails } =
    useAppSelector((state) => state.SliceofRating);
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<RateData>({
    ratingValue: 0,
    comment: "",
  });
  const [selectedReview, setSelectedReview] = useState<ClinicReviews | null>(
    null
  );

  useEffect(() => {
    dispatch(getUserRates());
  }, [dispatch]);

  const handleReviewClick = async (reviewId: number) => {
    await dispatch(getRateById(reviewId));
    const selected = reviewUserClinic?.find((r) => r.id === reviewId);
    if (selected) {
      setSelectedReview(selected);
    }
  };

  const handleBackToList = () => {
    setSelectedReview(null);
  };

  const handleEditClick = (review: ClinicReviews) => {
    setEditingReview(review.id);
    setEditValues({
      ratingValue: review.ratingValue,
      comment: review.comment || "",
    });
  };

  const handleEditSubmit = async (rateId: number) => {
    try {
      await dispatch(updateRate({ values: editValues, rateId }));
      setEditingReview(null);
      dispatch(getUserRates());
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await dispatch(deleteRate(id));
        dispatch(getUserRates());
        setSelectedReview(null);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const toggleComment = (id: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderStars = (rating: number, editable = false) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return Array.from({ length: 5 }, (_, i) => {
      if (editable) {
        return (
          <button
            key={i}
            onClick={() =>
              setEditValues((prev) => ({
                ...prev,
                ratingValue: i + 1,
              }))
            }
            className="text-amber-500 hover:scale-110 transition-transform"
          >
            {i < editValues.ratingValue ? <FaStar /> : <FaRegStar />}
          </button>
        );
      }

      if (i < fullStars) return <FaStar key={i} className="text-amber-500" />;
      if (i === fullStars && hasHalfStar)
        return <FaStarHalfAlt key={i} className="text-amber-500" />;
      return <FaRegStar key={i} className="text-amber-500" />;
    });
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Error Loading Reviews
          </h3>
          <p className="text-slate-600 mb-6">
            We couldn{"'"}t load your reviews. Please check your connection and
            try again.
          </p>
          <button
            onClick={() => dispatch(getUserRates())}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (selectedReview) {
    return (
      <div className="my-4 rounded-2xl md:rounded-[0] md:my-0 max-w-7xl mx-auto px-4 sm:px-6 py-10 bg-gradient-to-b from-white to-green-200 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10"
        >
          <button
            onClick={handleBackToList}
            className="p-2 rounded-full hover:bg-green-100 transition-colors"
          >
            {""}
            <MdArrowBack className="text-2xl text-green-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Review Details</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <Link href={`/clinics/${selectedReview.clinicId}/`} className="text-xl font-semibold text-slate-800 hover:text-green-600 transition-colors">
                  {selectedReview.clinicName}
                </Link>
                <p className="text-sm text-slate-500">
                  ID: {selectedReview.clinicId}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {renderStars(selectedReview.ratingValue)}
                </div>
                <span className="text-lg font-medium text-slate-700">
                  {selectedReview.ratingValue.toFixed(1)}
                </span>
                <span className="text-sm text-slate-500 ml-auto">
                  {selectedReview.createdAt &&
                    format(new Date(selectedReview.createdAt), "MMM d, yyyy")}
                </span>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-600 mb-2">
                  Review Comment
                </h3>
                <p className="text-slate-700 whitespace-pre-line break-words">
                  {selectedReview.comment || (
                    <span className="text-slate-400 italic">
                      No comment provided
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-600 mb-2">
                  Reviewer Information
                </h3>
                <p className="text-slate-700">
                  {ratingDetails?.userName || "Anonymous User"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {ratingDetails?.createdAt &&
                    format(
                      new Date(ratingDetails.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                </p>
              </div>

              <div className="flex justify-center" >
                <button
                  onClick={() => handleDelete(selectedReview.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-2xl md:rounded-[0] md:my-0 w-full mx-auto px-4 sm:px-6 py-10 bg-gradient-to-b from-white to-green-200 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-10 px-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-100"
      >
        <div className="p-3 bg-green-100/80 rounded-xl">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Clinic Reviews
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {reviewUserClinic?.length || 0} reviews · Last updated{" "}
            {format(new Date(), "MMM d")}
          </p>
        </div>
      </motion.div>

      {reviewUserClinic?.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-medium">
              <div className="col-span-3">Clinic</div>
              <div className="col-span-2">Rating</div>
              <div className="col-span-5">Feedback</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>

            <AnimatePresence>
              {reviewUserClinic?.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-slate-100 hover:bg-green-50/30 transition-colors"
                >
                  <div className="col-span-3 min-h-[60px] flex flex-col justify-center">
                    <div
                      onClick={() => handleReviewClick(review.id)}
                      className="font-medium text-slate-800 cursor-pointer hover:text-green-600 transition-colors"
                    >
                      {review.clinicName}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      ID: {review.clinicId}
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center gap-2 min-h-[60px]">
                    {editingReview === review.id ? (
                      <div className="flex items-center gap-1.5">
                        {renderStars(editValues.ratingValue, true)}
                        <span className="text-slate-700 text-sm font-medium">
                          {editValues.ratingValue.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {renderStars(review.ratingValue)}
                        <span className="ml-2 text-slate-700 text-sm font-medium">
                          {review.ratingValue.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="col-span-5 text-slate-700 relative min-h-[60px]">
                    {editingReview === review.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editValues.comment}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              comment: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          rows={3}
                          placeholder="Share your experience..."
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingReview(null)}
                            className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                          >
                            <MdClose className="text-lg" />
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditSubmit(review.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                          >
                            <MdCheck className="text-lg" />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="group relative">
                        <div
                          className={`text-sm transition-all ${
                            expandedComments[review.id] ? "" : "line-clamp-2"
                          } break-words`}
                        >
                          {review.comment || (
                            <span className="text-slate-400 italic">
                              No review text provided
                            </span>
                          )}
                        </div>
                        {review.comment && review.comment.length > 120 && (
                          <div className="absolute bottom-0 right-0 bg-gradient-to-l from-white to-transparent w-20 h-6 flex justify-end items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleComment(String(review.id));
                              }}
                              className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1 font-medium bg-white pl-2"
                            >
                              {expandedComments[review.id] ? (
                                <>
                                  <MdExpandLess className="text-base" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <MdExpandMore className="text-base" />
                                  Show More
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-span-1 text-sm text-slate-500 flex items-center min-h-[60px]">
                    {review.createdAt &&
                      format(new Date(review.createdAt), "MMM dd")}
                  </div>

                  <div className="col-span-1 flex justify-center items-center gap-3 min-h-[60px]">
                    {editingReview !== review.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(review);
                          }}
                          className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          aria-label="Edit review"
                        >
                          <MdEdit className="text-xl" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(review.id);
                          }}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete review"
                        >
                          <MdDelete className="text-xl" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {reviewUserClinic?.map((review) => (
              <motion.div
                key={review.id}
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-5 border border-slate-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3
                      onClick={() => handleReviewClick(review.id)}
                      className="font-semibold text-slate-800 cursor-pointer hover:text-green-600 transition-colors"
                    >
                      {review.clinicName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      ID: {review.clinicId}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {review.createdAt &&
                      format(new Date(review.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-amber-500">
                    {renderStars(review.ratingValue)}
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {review.ratingValue.toFixed(1)}
                  </span>
                </div>

                <div className="text-slate-700 relative">
                  {editingReview === review.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editValues.comment}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                        rows={3}
                        placeholder="Share your experience..."
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingReview(null);
                          }}
                          className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                        >
                          <MdClose className="text-lg" />
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSubmit(review.id);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <MdCheck className="text-lg" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <div
                        className={`text-sm ${
                          expandedComments[review.id] ? "" : "line-clamp-3"
                        } break-words`}
                      >
                        {review.comment || (
                          <span className="text-slate-400 italic">
                            No review text provided
                          </span>
                        )}
                      </div>
                      {review.comment && review.comment.length > 100 && (
                        <div className="mt-1 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComment(String(review.id));
                            }}
                            className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1 font-medium"
                          >
                            {expandedComments[review.id] ? (
                              <>
                                <MdExpandLess className="text-base" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <MdExpandMore className="text-base" />
                                Show More
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2 justify-end">
                  {editingReview !== review.id && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(review);
                        }}
                        className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        {""}
                        <MdEdit className="text-xl" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(review.id);
                        }}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        {""}
                        <MdDelete className="text-xl" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-slate-200"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Share Your Experience
            </h3>
            <p className="text-slate-600 mb-6 text-sm max-w-xs mx-auto">
              Help others find the best care by reviewing your recent clinic
              visits
            </p>
            <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
              <Link href={"/clinics/view"}>Find Clinics to Review</Link>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}