"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { getMyClinic } from "@/store/Features/clinic.slice";
import { Clinic } from "@/types/clinic.type";
import ClinicsFilter from "@/Components/ClinicsFilter/ClinicsFilter";
import Loading from "@/Components/Loading/loading";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import MyClinicCard from "@/Components/MyClinicCard/MyClinicCard";
import { motion } from "framer-motion";

export default function MyClinics() {
  const dispatch = useAppDispatch();
  const { myClinicList, isLoading, isError } = useAppSelector(
    (state) => state.clinicSlice
  );
  const { user } = useAppSelector((state) => state.userSlice);
  const adminRole = user ? Number(user) : null;

  const [filteredClinics, setFilteredClinics] = useState(myClinicList || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("relevance");

  useEffect(() => {
    dispatch(getMyClinic());
  }, [dispatch]);

  useEffect(() => {
    if (myClinicList) {
      let result = [...myClinicList];

      if (adminRole !== 2) {
        result = result.filter((clinic) => clinic.status === 1);
      }

      if (searchQuery) {
        result = result.filter((clinic) =>
          clinic.clinicName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (locationQuery) {
        result = result.filter(
          (clinic) =>
            clinic.address?.city
              ?.toLowerCase()
              .includes(locationQuery.toLowerCase()) ||
            clinic.address?.street
              ?.toLowerCase()
              .includes(locationQuery.toLowerCase())
        );
      }

      switch (activeFilter) {
        case "premium":
          result = result.filter((clinic) => clinic.rating >= 4.5);
          break;
        case "new":
          // Add logic for new clinics
          break;
        case "verified":
          // Add logic for verified clinics
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
    }
  }, [
    myClinicList,
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  const stats = [
    {
      label: "Total Clinics",
      value: myClinicList?.length || 0,
      color: "text-gray-900",
    },
    {
      label: "Active",
      value: myClinicList?.filter((c) => c.status === 1).length || 0,
      color: "text-green-600",
    },
    {
      label: "Not Active",
      value: myClinicList?.filter((c) => c.status !== 1).length || 0,
      color: "text-red-600",
    },
    {
      label: "Premium",
      value:
        myClinicList?.filter((c) => c.rating >= 4.5 && c.status === 1).length ||
        0,
      color: "text-yellow-500",
    },
  ];

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Clinics
          </h2>
          <p className="text-gray-600">
            We couldn{"'"}t load the clinic data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Clinics</h1>
          <p className="text-gray-600">
            Manage your clinics and view their details
          </p>
        </div>
        <Link
          href="/clinics/add"
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FaPlus className="text-white" />
          <span>Add New Clinic</span>
        </Link>
      </div>
      {/* Stats Bar */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition"
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
          >
            <p className="text-sm font-medium text-gray-500 mb-1">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div></div>

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
            <p className="text-gray-500 text-sm">
              Showing {Math.min(filteredClinics.length, 10)} of{" "}
              {filteredClinics.length}
            </p>
          </div>

          {filteredClinics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClinics.map((clinic: Clinic, index) => (
                <MyClinicCard
                  key={clinic.id}
                  clinic={clinic}
                  clinicIndex={index}
                       price={clinic.id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No clinics found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
