"use client";
import { useEffect, useMemo, useState } from "react";
import Categories from "@/Components/Categories/Categories";
import SearchBar from "@/Components/SearchBar/SearchBar";
import Card from "@/Components/Card/Card";
import Brands from "@/Components/Brands/Brands";
import Brand1 from "@/assets/images/image 21.png";
import Brand2 from "@/assets/images/image 22.png";
import Brand3 from "@/assets/images/image 23.png";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { getProduts } from "@/store/Features/user.product";
import Loading from "@/Components/Loading/loading";

export default function Shop() {
  const dispatch = useAppDispatch();
  const { msg, products, isError, isLoading } = useAppSelector(
    (store) => store.productSlice
  );
  // console.log(products);
  

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const brandImages = useMemo(
    () => [Brand1.src, Brand2.src, Brand3.src],
    []
  );

  // Fetch all products on sort change
  useEffect(() => {
    dispatch(
      getProduts({
        pageIndex: 1,
        pageSize: 188,
        sort,
        search: searchTerm,
      })
    );
    setPageIndex(1); // Reset to first page on sort
  }, [dispatch, searchTerm, sort]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    if (selectedCategory) {
      return products.filter(
        (product) =>
          product.categoryName.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }
    return products;
  }, [products, selectedCategory]);

  // Paginate filtered products
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, pageIndex, pageSize]);

  if (isError) {
    return <p className="text-red-500 text-center">{msg}</p>;
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* Search */}
      <div className="py-5 px-4 md:px-6 lg:px-8">
      <SearchBar onSearch={(value) => setSearchTerm(value)} />
      </div>

      {/* Categories Filter */}
      <div className="flex justify-center mt-4 ">
        <Categories
          setSelectedCategory={(category) => {
            setSelectedCategory(category);
            setPageIndex(1); // Reset to first page when category changes
          }}
        />
      </div>
      {/* Brand Section */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <h2 className="text-3xl font-bold text-gray-800 font-[Poppins] mb-6">
          Trusted Brands
        </h2>
        <div className="bg-white lg:py-2 px-3 rounded-2xl shadow-sm">
          <Brands images={brandImages} />
        </div>
      </div>

      {/* Product List */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 font-[Poppins] mb-6">
          Our Products
        </h2>
      {/* Sort Options */}
      <div className="">
        <div className="flex items-center gap-2 mb-6">
          <label htmlFor="s1" className="text-gray-600 font-medium">Sort:</label>
          <select
          id="s1"
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Default</option>
            <option value="priceasc">Price: Low to High</option>
            <option value="pricedesc">Price: High to Low</option>
            <option value="nameasc">Name: A-Z</option>
            <option value="namedesc">Name: Z-A</option>
          </select>
        </div>
      </div>
        </div>

        {!isLoading ? (
          <>
            <div className="grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5">
              {paginatedProducts.map((product) => (
                <Card key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-12">
              <div className={`$inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border`}>
                <button
                  onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
                  disabled={pageIndex === 1}
                  className={`${pageIndex === 1 ? "cursor-not-allowed" : "cursor-pointer"} px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50`}
                >
                  Prev
                </button>

                <span className="px-4 py-1 text-gray-600 font-semibold">
                  Page {pageIndex} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setPageIndex((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={pageIndex === totalPages}
                  className={`${pageIndex === totalPages ? "cursor-not-allowed" : "cursor-pointer"} px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
