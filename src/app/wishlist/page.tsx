"use client";
import Loading from "@/Components/Loading/loading";
import WishListCard from "@/Components/WishListCard/WishListCard";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { getWishList, clearWishlist } from "@/store/Features/wishlist";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaBroom, FaHeartBroken, FaThLarge, FaThList } from "react-icons/fa";
import ConfirmationModal from "@/Components/ConfirmationModal/ConfirmationModal";
import EmptyWishlist from "@/Components/EmptyWishlist/EmptyWishlist";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export default function WishList() {
  const { WishListData, isError, isLoading } = useAppSelector(
    (state) => state.userWishlisttSlice
  );
  const dispatch = useAppDispatch();
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    dispatch(getWishList());
  }, [dispatch]);

  const handleClearWishlist = async () => {
    setIsClearing(true);
    try {
      await dispatch(clearWishlist()).unwrap();
      dispatch(getWishList());
    } catch (error) {
      console.error("Failed to clear wishlist:", error);
    } finally {
      setIsClearing(false);
      setShowClearModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loading />
          <p className="text-gray-500">Loading your wishlist items...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-sm">
          <FaHeartBroken className="mx-auto text-5xl text-rose-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn{"'"}t connect to your wishlist. Please check your
            connection and try again.
          </p>
          <button
            onClick={() => dispatch(getWishList())}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Retry Now
          </button>
        </div>
      </div>
    );
  }

  const isEmpty = !WishListData?.items || WishListData.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isEmpty ? (
          <EmptyWishlist />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-serif">
                  My Favorites
                </h1>
                <p className="text-gray-500 mt-2">
                  You have {WishListData.items?.length}{" "}
                  {WishListData.items?.length === 1 ? "item" : "items"} saved
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
                  <button
                    type="button"
                    aria-label="Grid view"
                    title="Grid view"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-gray-100 text-emerald-600"
                        : "text-gray-500"
                    }`}
                  >
                    <FaThLarge />
                    <span className="sr-only">Grid view</span>
                  </button>
                  <button
                    type="button"
                    aria-label="List view"
                    title="List view"
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-gray-100 text-emerald-600"
                        : "text-gray-500"
                    }`}
                  >
                    <FaThList />
                    <span className="sr-only">List view</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowClearModal(true)}
                  disabled={isClearing}
                  className="flex items-center gap-2 text-rose-600 hover:text-rose-700 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-rose-200 transition-colors"
                >
                  <FaBroom />
                  <span className="font-medium">
                    {isClearing ? "Clearing..." : "Clear All"}
                  </span>
                </button>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              <AnimatePresence mode="popLayout">
                {WishListData.items?.map((current) => (
                  <motion.div
                    key={current.id}
                    variants={itemVariants}
                    layout
                    exit="exit"
                  >
                    <WishListCard product={current} viewMode={viewMode} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearWishlist}
        title="Clear All Favorites?"
        message="This will permanently remove all items from your wishlist. You can't undo this action."
        confirmText={isClearing ? "Clearing..." : "Yes, Clear All"}
        confirmColor="rose"
      />
    </div>
  );
}