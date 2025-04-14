import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import Image from "next/image";
import { Product } from "@/types/products.type";

export default function Card({ product }: { product: Product }) {
  return (
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl hover:border-green-500 transition-transform transform hover:-translate-y-1 group duration-300 ease-in-out">
      <Link href={`/shop/${product.id}`}>
        {/* Product Image */}
        <div className="relative ">
          <Image
            src={product.pictureUrl}
            alt={product.name}
            width={400}
            height={400}
            className="border-1 border-gray-300 p-5 w-full object-cover 2xl:h-auto xl:h-64 lg:h-52 md:h-48 sm:h-40 rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
          />

          {/* Add to Cart Button - Desktop */}
          <button className="hidden lg:block absolute -bottom-2 left-0 w-full bg-green-600 text-white text-sm font-[Fredoka] font-medium py-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-full transition-all duration-300 rounded-t-xl hover:bg-green-800">
            Add to Cart
          </button>

          {/* Add to Cart Icon - Mobile */}
          <button className="lg:hidden block absolute bottom-3 right-3 bg-white border border-gray-300 text-black p-2 rounded-full shadow-sm">
            {""}
            <FaPlus />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Category */}
          <span className="text-xs uppercase tracking-wide text-gray-400">
            {product.categoryName}
          </span>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-800 mt-1 truncate">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-gray-500 mt-2">
            {product.description
              ? product.description.slice(0, 80)
              : "No description available."}
            .
          </p>

          {/* Pricing & Quantity */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-green-600 font-bold text-lg">
              {product.price} EGP
            </span>
            <span className="text-sm bg-gray-100 lg:px-3 py-1 rounded-full text-gray-700 font-medium shadow-sm text-center">
              In Stock:{" "}
              <span className="text-green-600 font-semibold">
                {product.quantity}
              </span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
