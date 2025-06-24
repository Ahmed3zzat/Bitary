"use client";
import Link from "next/link";
import { FaPlus, FaHeart, FaRegHeart } from "react-icons/fa";
import Image from "next/image";
import { Product } from "@/types/products.type";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import {
  addItemCart,
  createCart,
  getCartById,
  clearCartState,
} from "@/store/Features/user.cart";
import {
  AddProductToWishList,
  delteItemWishlist,
  getWishList,
} from "@/store/Features/wishlist";
import { motion } from "framer-motion";

export default function GlobalProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const { WishListData } = useAppSelector((state) => state.userWishlisttSlice);
  const isInWishlist = WishListData?.items?.some(
    (item) => item.productId === product.id
  );

  const handleAddToCart = async () => {
    try {
      await dispatch(getCartById()).unwrap();
      await dispatch(addItemCart({ productId: product.id, quantity: 1 }));
      await dispatch(getCartById());
    } catch {
      dispatch(clearCartState());
      try {
        await dispatch(createCart()).unwrap();
        await dispatch(addItemCart({ productId: product.id, quantity: 1 }));
        await dispatch(getCartById());
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    }
  };

  const handleWishlist = async () => {
    if (isInWishlist) {
      try {
        await dispatch(delteItemWishlist(product.id)).unwrap();
      } catch (error) {
        console.error("Failed to remove from wishlist:", error);
      }
    } else {
      try {
        await dispatch(AddProductToWishList(product.id)).unwrap();
      } catch (error) {
        console.error("Failed to add to wishlist:", error);
      }
    }
    dispatch(getWishList());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ 
        duration: 0,
        ease: "easeOut",
        when: "beforeChildren" 
      }}
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 transition-all duration-300 overflow-hidden"
    >
      {/* Limited Stock Badge */}
      {product.quantity < 5 && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-red-500 text-white text-xs font-medium py-1 px-3 rounded-full shadow-sm">
            Limited Stock
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden border-1 border-gray-300">
        <Link href={`/shop/${product.id}`} className="block">
          <Image
            src={product.pictureUrl}
            alt={product.name}
            width={400}
            height={400}
            className="w-full p-4 object-contain transition-transform duration-300 aspect-square group-hover:scale-105"
            priority
          />
        </Link>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 transition-all"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-600 text-lg" />
          )}
        </motion.button>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {product.categoryName && (
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {product.categoryName}
          </span>
        )}
        
        <Link href={`/shop/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mt-2 line-clamp-2 leading-tight hover:text-green-400 hover:transition duration-200">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              <span className="text-sm text-green-400">EGP</span><span className="text-lg"> {product.price.toFixed(2)}</span> 
            </span>
            <span
              className={`text-xs mt-1 ${
                product.quantity > 0
                  ? "text-gray-400"
                  : "text-red-500 font-medium"
              }`}
            >
              {product.quantity > 0
                ? `${product.quantity} available`
                : "Out of stock"}
            </span>
          </div>

          <motion.button
            onClick={handleAddToCart}
            whileHover={{
              scale: 1.05,
              backgroundColor: "#059669",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors shadow-sm"
            disabled={product.quantity <= 0}
          >
            <FaPlus className="text-xs" />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}