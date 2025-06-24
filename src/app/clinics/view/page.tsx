"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { getClinic, getMyClinic } from "@/store/Features/clinic.slice";
import { Clinic } from "@/types/clinic.type";
import ClinicsFilter from "@/Components/ClinicsFilter/ClinicsFilter";
import ClinicCard from "@/Components/ClinicCard/ClinicCard";
import Loading from "@/Components/Loading/loading";
import Link from "next/link";
import { FaClinicMedical, FaPlus } from "react-icons/fa";

export default function ClinicsView() {
  const dispatch = useAppDispatch();
  const { ClinicList, myClinicList, isLoading, isError } = useAppSelector(
    (state) => state.clinicSlice
  );
  const { user } = useAppSelector((state) => state.userSlice);
  const adminRole = user ? Number(user) : null;

  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("relevance");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUserRole = localStorage.getItem("userRole");
    setUserRole(storedUserRole);
  }, []);

  useEffect(() => {
    if (userRole === "1") {
      dispatch(getMyClinic());
    }
  }, [dispatch, userRole]);

  useEffect(() => {
    dispatch(getClinic());
  }, [dispatch]);

  useEffect(() => {
    if (ClinicList) {
      let result = [...ClinicList];

      if (adminRole !== 2) {
        result = result.filter((clinic) => clinic.status === 1);
      }

      if (searchQuery && searchQuery.trim() !== '') {
        result = result.filter((clinic) =>
          clinic.clinicName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (locationQuery && locationQuery.trim() !== '') {
        result = result.filter(
          (clinic) =>
            (clinic.address?.city || '').toLowerCase().includes(locationQuery.toLowerCase()) ||
            (clinic.address?.street || '').toLowerCase().includes(locationQuery.toLowerCase())
        );
      }

      switch (activeFilter) {
        case "premium":
          result = result.filter((clinic) => clinic.rating >= 4.5);
          break;
      }

      switch (activeSort) {
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "name":
          result.sort((a, b) => a.clinicName.localeCompare(b.clinicName));
          break;
        case "name-desc":
          result.sort((a, b) => b.clinicName.localeCompare(a.clinicName));
          break;
      }

      setFilteredClinics(result);
      console.log("Filtered Clinics:", result, "Search Query:", searchQuery);
    }
  }, [
    ClinicList,
    searchQuery,
    locationQuery,
    activeFilter,
    activeSort,
    adminRole,
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLocationChange = (location: string) => {
    setLocationQuery(location);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleSortChange = (sort: string) => {
    setActiveSort(sort);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setActiveFilter("all");
    setActiveSort("relevance");
    dispatch(getClinic());
  };

  if (isError) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            {/* Icon with circle background */}
            <div className="mb-4 p-3 bg-red-100 rounded-full">
              <FaClinicMedical className="text-red-600 text-2xl" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-red-700 mb-2">
              Unable to Load Clinics
            </h2>

            {/* Description */}
            <p className="text-gray-700 mb-6 max-w-md">
              We encountered an issue while loading clinic data. This might be
              temporary - please try again or contact support if the problem
              persists.
            </p>

            {/* Action button */}
            <button
              onClick={() => dispatch(getClinic())}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center shadow-sm hover:shadow-md"
            >
              <FaClinicMedical className="mr-2" />
              <span>Retry Loading Clinics</span>
            </button>

            {/* Additional help text */}
            <p className="mt-4 text-sm text-gray-500">
              Still having trouble?{" "}
              <a href="#" className="text-red-600 hover:underline">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <div className="text">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Clinics
          </h1>
          <p className="text-gray-600 mb-8">
            Discover the best clinics in your area with verified reviews and
            ratings
          </p>
        </div>
        {isClient &&
        userRole === "1" &&
        myClinicList !== null &&
        myClinicList.length > 0 ? (
          <Link
            href="/clinics/view/myclinic"
            className="group inline-flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaClinicMedical className="text-green-600 group-hover:text-green-700 transition-colors" />
            <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              View Your Clinics
            </span>
          </Link>
        ) : isClient &&
          userRole === "1" &&
          myClinicList !== null &&
          myClinicList.length === 0 ? (
          <Link
            href="/clinics/add"
            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaPlus className="text-white" />
            <span>Add New Clinic</span>
          </Link>
        ) : null}
      </div>

      <ClinicsFilter
        onSearch={handleSearch}
        onLocationChange={handleLocationChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-gray-100 animate-pulse h-80"
            >
              <Loading />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredClinics.length}{" "}
              {filteredClinics.length === 1 ? "Clinic" : "Clinics"} Found
            </h2>
          </div>

          {filteredClinics.length > 0 ? (
            <div
              key={`${activeSort}-${activeFilter}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredClinics.map((clinic: Clinic, index) => (
                <ClinicCard
                  key={clinic.id}
                  clinic={clinic}
                  clinicIndex={index}
                  price={clinic.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="p-3 bg-gray-100 rounded-full mb-4">
                <FaClinicMedical className="text-gray-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Clinics Found</h3>
              <p className="text-gray-600 max-w-md">
                {searchQuery || locationQuery ? 
                  `No clinics match your search criteria "${searchQuery}" ${locationQuery ? `in "${locationQuery}"` : ''}.` : 
                  "There are no clinics available at the moment."}
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
