"use client";
import { useEffect, useMemo, useState } from "react";
import Categories from "@/Components/Categories/Categories";
import SearchBar from "@/Components/SearchBar/SearchBar";
import Card from "@/Components/Card/Card";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { getProduts } from "@/store/Features/user.product";
import Loading from "@/Components/Loading/loading";
import { getWishList } from "@/store/Features/wishlist";
import { fetchUserData } from "@/store/Features/profile.slice";


export default function Shop() {
  const dispatch = useAppDispatch();
  const { products, isError, isLoading } = useAppSelector(
    (store) => store.productSlice
  );


  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  // const brandImages = useMemo(() => [Brand1.src, Brand2.src, Brand3.src], []);

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

    useEffect(() => {
      dispatch(getWishList());
      dispatch(fetchUserData());
    }, [dispatch]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    if (selectedCategory) {
      return products.filter(
        (product) =>
          product.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
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
    return <div className="container mx-auto p-4">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-2">
        Error Loading Products
      </h2>
      <p className="text-gray-600">
        We couldn{"'"}t load the product data. Please try again later.
      </p>
    </div>
  </div>
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


      {/* Product List */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 font-[Poppins] mb-6">
            Our Products
          </h2>
          {/* Sort Options */}
          <div className="">
            <div className="flex items-center gap-2 mb-6">
              <label htmlFor="s1" className="text-gray-600 font-medium">
                Sort:
              </label>
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
            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-5">
              {paginatedProducts.map((product) => (
                <Card key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-12">
              <div
                className={`$inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border`}
              >
                <button
                  onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
                  disabled={pageIndex === 1}
                  className={`${
                    pageIndex === 1 ? "cursor-not-allowed" : "cursor-pointer"
                  } px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50`}
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
                  className={`${
                    pageIndex === totalPages
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50`}
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
