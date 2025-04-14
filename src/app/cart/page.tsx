import Image from "next/image";
import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import product1 from "@/assets/images/image 25.png";
import product2 from "@/assets/images/Frame 33.png";
import product3 from "@/assets/images/image 36.png";
import Link from "next/link";

export default function Cart() {
  const products = [
    {
      id: 1,
      img: product1,
      productName: "NexGuard Cream",
      price: "154",
      quantatiy: "3",
    },
    {
      id: 2,
      img: product2,
      productName: "CHECKERED SHIRT",
      price: "180",
      quantatiy: "9",
    },
    {
      id: 3,
      img: product3,
      productName: "SKINNY FIT JEANS",
      price: "220",
      quantatiy: "4",
    },
  ];

  return (
    <div className="container mx-auto space-y-8 my-8 px-4">
      <header className="flex justify-between items-baseline">
        <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-lg text-gray-500">{products.length} items</p>
      </header>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="w-full border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all">
          {products.map((current) => (
            <div
              key={current.id}
              className="relative flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={current.img}
                  alt={current.productName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {current.productName}
                  </h2>
                  <p className="text-md text-gray-600">${current.price}</p>
                </div>
              </div>
              <FaRegTrashAlt className="text-red-500 hover:text-red-600 cursor-pointer absolute top-4 right-4" />
              <div className="mt-auto">
                <div className="flex items-center justify-between gap-3 bg-gray-100 px-4 py-2 rounded-full">
                  <CiCircleMinus className="text-gray-600 hover:text-gray-800 cursor-pointer" />
                  <p className="text-lg font-medium">{current.quantatiy}</p>
                  <CiCirclePlus className="text-gray-600 hover:text-gray-800 cursor-pointer" />
                </div>
              </div>
            </div>
          ))}

          <p className="w-fit ms-auto mt-6 text-gray-600">
            Do you want to{" "}
            <span className="text-red-500 hover:text-red-600 cursor-pointer">
              clear cart
            </span>
            ?
          </p>
        </div>

        <div className="w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
          <div className="mt-6 space-y-4 text-gray-700">
            <div className="flex justify-between">
              <p className="text-lg">Subtotal</p>
              <p className="font-semibold">$565</p>
            </div>
            <div className="flex justify-between">
              <p className="text-lg">Discount (-20%)</p>
              <p className="text-red-500 font-semibold">-$113</p>
            </div>
            <div className="flex justify-between">
              <p className="text-lg">Delivery Fee</p>
              <p className="font-semibold">$15</p>
            </div>
            <hr className="my-4 border-gray-200" />
            <div className="flex justify-between text-xl font-bold">
              <p>Total</p>
              <p className="text-gray-900">$467</p>
            </div>
          </div>
          <div className="mt-6 flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
            <span className="text-gray-500">🏷️</span>
            <input
              type="text"
              placeholder="Add promo code"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-all cursor-pointer">
              Apply
            </button>
          </div>
          <Link
            href={"/payment"}
            className="mt-8 w-full py-3 bg-green-600 rounded-lg text-lg font-semibold text-white hover:bg-green-800 transition-all flex items-center justify-center gap-2"
          >
            Go to Checkout ➜
          </Link>
        </div>
      </div>

      {/* <div className="bg-green-600 py-12 px-8 flex flex-col md:flex-row justify-between items-center rounded-lg shadow-md">
        <h2 className="text-white text-2xl font-bold text-center md:text-left mb-4 md:mb-0">
          STAY UPTO DATE ABOUT OUR LATEST OFFERS
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email address"
              className="pl-10 pr-4 py-2 rounded-full outline-none border-none text-gray-700 w-64"
            />
          </div>
          <button className="bg-white text-green-500 py-2 px-6 rounded-full font-semibold hover:bg-gray-100 transition-all">
            Subscribe
          </button>
        </div>
      </div> */}
    </div>
  );
}