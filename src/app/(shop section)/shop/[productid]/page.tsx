"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/app/loading";

export default function ProductID() {
  const { productid } = useParams();
  const id: number = parseInt(productid as string, 10);
  const [count, setCount] = useState(1);

  interface ProductData {
    pictureUrl: string;
    name: string;
    price: number;
    description: string;
    quantity: number;
    brandName: string;
    categoryName: string;
  }

  const [data, setData] = useState<ProductData | null>(null);

  useEffect(() => {
    async function getProductData() {
      try {
        const response = await fetch(
          `http://bitary.runasp.net/api/Products/Product${id}`
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    }

    if (!isNaN(id)) {
      getProductData();
    }
  }, [id]);

  if (!data) {
    return (
      <Loading />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 text-gray-600 text-sm font-medium"
      >
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <Link href="/" className="hover:underline text-gray-500">
              Home
            </Link>
            <MdKeyboardArrowRight className="text-xl mx-1" />
          </li>
          <li className="flex items-center">
            <Link href="/shop" className="hover:underline text-gray-500">
              Shop
            </Link>
            <MdKeyboardArrowRight className="text-xl mx-1" />
          </li>
          <li className="text-black font-semibold">{data.name}</li>
        </ol>
      </nav>

      {/* Product Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start bg-white shadow-xl rounded-3xl p-8 md:p-12">
        {/* Image Section */}
        <div className="w-full flex justify-center">
          <Image
            src={data.pictureUrl}
            alt={data.name}
            width={500}
            height={500}
            className="rounded-3xl shadow-md object-contain"
          />
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-center h-full space-y-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-800 font-[Fredoka] mb-6">
              {data.name}
            </h1>
            <p className="text-md text-gray-500 font-medium">
              <span className="mr-3">
                Brand:{" "}
                <strong className="text-gray-700">{data.brandName}</strong>
              </span>
              | Category:{" "}
              <strong className="text-gray-700">
                {data.categoryName
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </strong>{" "}
            </p>
          </div>

          <p className="text-2xl text-green-600 font-semibold">
            {data.price} EGP
          </p>

          <p className="text-gray-600 leading-relaxed">{data.description}</p>

          <span className="block text-sm text-gray-500">
            Available Stock:{" "}
            <strong className="text-gray-800">{data.quantity}</strong>
          </span>

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-full px-6 py-3 shadow-inner w-full sm:w-1/3 justify-between">
              <button
                className="text-xl font-bold text-gray-600 hover:text-gray-800"
                onClick={() => setCount(count > 1 ? count - 1 : 1)}
              >
                -
              </button>
              <span className="text-lg font-medium">{count}</span>
              <button
                className="text-xl font-bold text-gray-600 hover:text-gray-800"
                onClick={() =>
                  setCount(count < data.quantity ? count + 1 : count)
                }
              >
                +
              </button>
            </div>

            <button className="bg-green-600 hover:bg-green-700 transition-all duration-200 text-white w-full sm:w-2/3 py-3 rounded-full text-lg font-semibold shadow-lg">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
    
  );
}
