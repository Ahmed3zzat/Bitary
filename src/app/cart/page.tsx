"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt, FaShoppingBag } from "react-icons/fa";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { FiArrowRight, FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import {
  clearCartState,
  delteCart,
  delteItemCart,
  getCartById,
  updateQuantaty,
} from "@/store/Features/user.cart";
import Loading from "@/Components/Loading/loading";
import { motion } from "framer-motion";

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items, id: basketId } = useAppSelector((store) => store.userCartSlice);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initCart = async () => {
      try {
        if (!basketId) {
          dispatch(clearCartState());
          setIsLoading(false);
          return;
        }
        await dispatch(getCartById());
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading cart:', error);
        dispatch(clearCartState());
        setIsLoading(false);
      }
    };

    initCart();
  }, [dispatch, basketId]);

  const total = items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleDeleteItem = async (productId: number) => {
    await dispatch(delteItemCart(productId));
    dispatch(getCartById());
  };

  const handleUpdate = async (
    updateValue: { itemId: number; quantity: number },
    flag: number
  ) => {
    let newQuantity = updateValue.quantity;
    if (flag === 1) {
      newQuantity += 1;
    } else if (flag === -1) {
      newQuantity -= 1;
    }
    if (newQuantity < 1) return;
    await dispatch(
      updateQuantaty({ itemId: updateValue.itemId, quantity: newQuantity })
    );
    dispatch(getCartById());
  };

  if (isLoading) return <Loading />;

  // Show empty cart state when there's no basket ID or no items
  if (!basketId || !items || items.length === 0) {
    return (
      <div className="bg-gray-50 py-22 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-12 py-16 text-center shadow-sm border border-gray-100">
            <FaShoppingBag className="mx-auto text-5xl text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Looks like you haven&apos;t added anything to your cart yet. Start
              shopping to fill it with amazing products!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Shopping <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 py-22 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="flex items-center mb-4 md:mb-0">
            <FiShoppingCart className="text-3xl text-green-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Your Shopping Cart
            </h1>
          </div>
          <p className="text-lg text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </header>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          {/* Cart Items Section */}
          <div className="w-full border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
            {items.map((current) => (
              <motion.div
                key={current.productId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-6 w-full sm:w-2/3">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={current.pictureUrl}
                      alt={current.productName}
                      width={500}
                      height={500}
                      priority
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors">
                      <Link href={`/shop/${current.productId}`}>
                        {current.productName}
                      </Link>
                    </h2>
                    {current.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {current.description}
                      </p>
                    )}
                    <p className="text-md text-green-600 mt-2">
                      <span className="font-medium text-gray-600">
                        Price: EGP
                      </span>{" "}
                      {current.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                    <button
                      onClick={() => {
                        if (current.productId) {
                          handleUpdate(
                            {
                              itemId: current.productId,
                              quantity: current.quantity,
                            },
                            -1
                          );
                        }
                      }}
                      className="text-gray-600 hover:text-gray-800 cursor-pointer text-xl transition-colors"
                    >
                    
                      <CiCircleMinus />
                    </button>

                    <p className="text-lg font-medium w-8 text-center">
                      {current.quantity}
                    </p>

                    <button
                      onClick={() => {
                        if (current.productId) {
                          handleUpdate(
                            {
                              itemId: current.productId,
                              quantity: current.quantity,
                            },
                            1
                          );
                        }
                      }}
                      className="text-gray-600 hover:text-gray-800 cursor-pointer text-xl transition-colors"
                    >
                      <CiCirclePlus />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      if (current.productId) {
                        handleDeleteItem(current.productId);
                      }
                    }}
                    className="text-red-500 hover:text-red-600 cursor-pointer text-xl transition-colors"
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-between items-center mt-8">
              <Link
                href="/shop"
                className="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors"
              >
                <FiArrowRight className="rotate-180 mr-2" />
                Continue Shopping
              </Link>
              <button
                onClick={() => dispatch(delteCart())}
                className="text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="h-fit bg-white rounded-2xl p-8 shadow-sm border border-gray-200 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-900">EGP {total?.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="text-gray-900">Free</p>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold">
                  <p>Total</p>
                  <p className="text-gray-900">EGP {total?.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <Link
              href="/payment"
              className="mt-8 w-full py-3.5 bg-green-600 rounded-lg text-lg font-semibold text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout <FiArrowRight />
            </Link>
            <p className="text-center text-sm text-gray-500 mt-4">
              Secure checkout process
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
