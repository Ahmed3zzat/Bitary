"use client";
import { WishlistItem } from "@/types/wishlist.types";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCartPlus, FaTrash, FaHeart, FaRegClock, FaTag } from "react-icons/fa";
import { useAppDispatch } from "@/hooks/store.hook";
import { delteItemWishlist, getWishList } from "@/store/Features/wishlist";
import { addItemCart, getCartById } from "@/store/Features/user.cart";
import { useState } from "react";

interface WishListCardProps {
  product: WishlistItem;
  viewMode: "grid" | "list";
}

export default function WishListCard({ product, viewMode }: WishListCardProps) {
  const dispatch = useAppDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleRemoveFromWishlist = async () => {
    setIsRemoving(true);
    try {
      await dispatch(delteItemWishlist(product.productId)).unwrap();
      dispatch(getWishList());
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await dispatch(addItemCart({ productId: product.productId, quantity: 1 })).unwrap();
      dispatch(getCartById());

    } finally {
      setIsAddingToCart(false);
    }
  };

  // Grid View Mode
  if (viewMode === "grid") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
      >
        {/* Product Badges */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-10 ">
          <span className="inline-flex items-center text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
            #{product.id}
          </span>
          {product.productCategory && (
            <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              <FaTag className="mr-1 text-xs" />
              {product.productCategory}
            </span>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemoveFromWishlist}
          aria-label="Remove from wishlist"
          disabled={isRemoving}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors z-10"
        >
          {isRemoving ? (
            <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FaHeart className="fill-current text-rose-500" />
          )}
        </button>

        {/* Product Image */}
        <div className="aspect-square relative bg-gray-50 mt-16">
          <Image
            src={product.productPictureUrl}
            alt={product.productName}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Product Info */}
        <div className="p-4 border-t border-gray-100">
          <div className="mb-2 min-h-[3rem]">
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {product.productName}
            </h3>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">
              {product.productBrand}
            </span>
            <span className="text-xs text-gray-400 flex items-center">
              <FaRegClock className="mr-1" />
              {new Date(product.addedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
              })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-emerald-600">
              EGP {product.productPrice.toFixed(2)}
            </span>
            
            <motion.button
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 shadow-sm transition-colors"
              whileTap={{ scale: 0.9 }}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaCartPlus size={16} />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // List View Mode
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 p-4 gap-4"
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
        <Image
          src={product.productPictureUrl}
          alt={product.productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h3 className="font-medium text-lg text-gray-900 line-clamp-2">
              {product.productName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">
                {product.productBrand}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-blue-600 font-medium">
                {product.productCategory}
              </span>
            </div>
          </div>
          <button
            onClick={handleRemoveFromWishlist}
            aria-label="Remove from wishlist"
            className="p-2 text-gray-400 hover:text-rose-500 transition-colors flex-shrink-0"
            disabled={isRemoving}
          >
            {isRemoving ? (
              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaTrash size={16} />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg text-emerald-600">
              EGP {product.productPrice.toFixed(2)}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              #{product.id}
            </span>
            <span className="text-xs text-gray-400 flex items-center">
              <FaRegClock className="mr-1" />
              {new Date(product.addedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
              })}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="flex items-center gap-2 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <FaCartPlus size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}