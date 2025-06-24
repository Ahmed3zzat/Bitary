"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaMapMarkerAlt } from "react-icons/fa";

interface FilterOption {
  value: string;
  label: string;
}

interface ClinicsFilterProps {
  onSearch: (query: string) => void;
  onLocationChange: (location: string) => void;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
}

export default function ClinicsFilter({
  onSearch,
  onLocationChange,
  onFilterChange,
  onSortChange,
}: ClinicsFilterProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // const availabilityOptions: FilterOption[] = [
  //   { value: "any", label: "Any Availability" },
  //   { value: "today", label: "Available Today" },
  //   { value: "tomorrow", label: "Available Tomorrow" },
  // ];

  const filterOptions: FilterOption[] = [
    { value: "all", label: "All Clinics" },
    { value: "premium", label: "Premium Only" },
    // { value: "new", label: "New Clinics" },
    // { value: "verified", label: "Verified Only" },
  ];

  const sortOptions: FilterOption[] = [
    { value: "relevance", label: "Relevance" },
    { value: "rating", label: "Highest Rating" },
    { value: "name", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ];

  // Apply search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);
  
  // Apply location search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onLocationChange(locationQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [locationQuery, onLocationChange]);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleLocationChange = () => {
    onLocationChange(locationQuery);
  };

  const renderDropdown = (options: FilterOption[], type: string) => {
    if (activeMenu !== type) return null;

    return (
      <div className="absolute mt-2 w-56 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              if (type === "filter") {
                onFilterChange(option.value);
              } else if (type === "sort") {
                onSortChange(option.value);
              }
              setActiveMenu(null);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Location Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaMapMarkerAlt className="text-gray-600" />
          </div>
          <input
            type="text"
            placeholder="Search by location..."
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLocationChange()}
          />
        </div>

        {/* Clinic Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-600" />
          </div>
          <input
            type="text"
            placeholder="Search clinics..."
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-6 py-3 transition-colors flex items-center justify-center"
        >
          <FaSearch className="mr-2" />
          Search Clinics
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Availability Filter */}
        {/* <div className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === "availability" ? null : "availability")}
            className="flex items-center bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg text-gray-700 transition-colors"
          >
            Availability
            <FaChevronDown
              className={`ml-2 transition-transform ${
                activeMenu === "availability" ? "rotate-180" : ""
              }`}
            />
          </button>
          {renderDropdown(availabilityOptions, "availability")}
        </div> */}

        {/* Clinic Filters */}
        <div className="relative">
          <button
            onClick={() =>
              setActiveMenu(activeMenu === "filter" ? null : "filter")
            }
            className="flex items-center bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg text-gray-700 transition-colors"
          >
            Filters
            <FaChevronDown
              className={`ml-2 transition-transform ${
                activeMenu === "filter" ? "rotate-180" : ""
              }`}
            />
          </button>
          {renderDropdown(filterOptions, "filter")}
        </div>

        {/* Sort Options */}
        <div className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === "sort" ? null : "sort")}
            className="flex items-center bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg text-gray-700 transition-colors"
          >
            Sort By
            <FaChevronDown
              className={`ml-2 transition-transform ${
                activeMenu === "sort" ? "rotate-180" : ""
              }`}
            />
          </button>
          {renderDropdown(sortOptions, "sort")}
        </div>
      </div>
    </div>
  );
}
