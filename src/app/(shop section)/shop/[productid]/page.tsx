"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MdKeyboardArrowRight, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import {
  addItemCart,
  createCart,
  getCartById,
} from "@/store/Features/user.cart";
import toast from "react-hot-toast";
import { AddProductToWishList, delteItemWishlist, getWishList } from "@/store/Features/wishlist";

interface ProductData {
  pictureUrl: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  brandName: string;
  categoryName: string;
}

export default function ProductDetailsPage() {
  const dispatch = useAppDispatch();
  const { productid } = useParams();
  const id = parseInt(productid as string, 10);
  const [count, setCount] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [data, setData] = useState<ProductData | null>(null);
  
  const wishlist = useAppSelector(state => state.userWishlisttSlice.WishListData?.items);
  const isWishlisted = wishlist?.some(item => item.productId === id);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `http://bitary.runasp.net/api/Products/Product${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch product");
        setData(await response.json());
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        toast.error("Failed to load product details");
      }
    };

    if (!isNaN(id)) {
      fetchProductData();
      dispatch(getWishList());
    }
  }, [id, dispatch]);

  const handleWishlist = async () => {
    try {
      if (isWishlisted) {
        await dispatch(delteItemWishlist(id)).unwrap();
      } else {
        await dispatch(AddProductToWishList(id)).unwrap();
      }
      dispatch(getWishList());
    } catch (error) {
      toast.error(`Failed to ${isWishlisted ? 'remove from' : 'add to'} wishlist`);
      console.error("Wishlist error:", error);
    }
  };

  const addToCart = async () => {
    setIsAddingToCart(true);
    try {
      await dispatch(getCartById())
        .unwrap()
        .then(() => {
          dispatch(addItemCart({ productId: id, quantity: count }));
        })
        .catch(async (error) => {
          await dispatch(createCart()).unwrap();
          dispatch(addItemCart({ productId: id, quantity: count }))
          console.log(error);
        
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!data) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm font-medium text-gray-600">
          {[
            { href: "/", label: "Home" },
            { href: "/shop", label: "Shop" },
            { label: data.name },
          ].map((item, index) => (
            <li key={index} className="flex items-center">
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:underline hover:text-green-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-green-700 font-semibold truncate max-w-[200px]">
                  {item.label}
                </span>
              )}
              {index < 2 && <MdKeyboardArrowRight className="text-xl mx-1 text-gray-400" />}
            </li>
          ))}
        </ol>
      </nav>

      {/* Product Container */}
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
          {/* Product Image */}
          <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden">
            <button 
              onClick={handleWishlist}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlisted ? (
                <MdFavorite className="text-2xl text-red-500" />
              ) : (
                <MdFavoriteBorder className="text-2xl text-gray-500 hover:text-red-500 transition-colors" />
              )}
            </button>
            
            <Image
              src={data.pictureUrl}
              alt={data.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {data.brandName}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {data.categoryName
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-green-600">
                  {data.price.toLocaleString()} EGP
                </p>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  data.quantity > 0 
                    ? "text-green-800 bg-green-100" 
                    : "text-red-800 bg-red-100"
                }`}>
                  {data.quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="prose text-gray-600">
              <p>{data.description}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-gray-500">
                  Available: <span className="font-medium text-gray-700">{data.quantity}</span>
                </span>
                
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-full">
                    <button
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-600 hover:text-gray-800 disabled:opacity-30"
                      onClick={() => setCount(prev => Math.max(1, prev - 1))}
                      disabled={count <= 1}
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-medium">{count}</span>
                    <button
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-600 hover:text-gray-800 disabled:opacity-30"
                      onClick={() => setCount(prev => Math.min(data.quantity, prev + 1))}
                      disabled={count >= data.quantity}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={addToCart}
                disabled={isAddingToCart || data.quantity === 0}
                className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-200 flex items-center justify-center ${
                  data.quantity === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {isAddingToCart ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}