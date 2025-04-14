"use client";

import { useState } from "react";
import { FaSearch, FaChevronDown, FaSearchLocation } from "react-icons/fa";

// Define the props interface for the component
interface ClinicsFilterProps {
  setAvailability: (value: string) => void; // Function to set availability filter
  setFilter: (value: string) => void;       // Function to set other filters
  setSortBy: (value: string) => void;       // Function to set sorting criteria
}

// Main component
export default function ClinicsFilter({
  setAvailability,
  setFilter,
  setSortBy,
}: ClinicsFilterProps) {
  // State to track the currently active dropdown menu
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Function to toggle the visibility of a dropdown menu
  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Function to handle selection from dropdown menus
  const handleSelection = (
    type: "availability" | "filter" | "sortBy",
    value: string
  ) => {
    if (type === "availability") setAvailability(value); // Update availability filter
    if (type === "filter") setFilter(value);             // Update other filters
    if (type === "sortBy") setSortBy(value);             // Update sorting criteria
    setActiveMenu(null); // Close the dropdown menu after selection
  };

  // Function to render a dropdown menu with options
  const renderDropdown = (type: "availability" | "filter" | "sortBy", options: string[]) => {
    if (activeMenu !== type) return null; // Render dropdown only if it's active

    return (
      <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
        {options.map((option) => (
          <div
            key={option}
            onClick={() => handleSelection(type, option)} // Handle option selection
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {option}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6 px-2 lg:px-6 py-5 rounded-lg mb-5 bg-[#E9E5E5] shadow-sm">
      {/* Search Section */}
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        {/* Location Input */}
        <div className="flex-1">
          <div className="bg-white rounded-lg flex items-center shadow-sm">
          <FaSearchLocation className="text-gray-500 text-3xl ms-3" />
            <input
              type="text"
              placeholder="Set your location"
              className="p-4 w-full rounded-lg text-gray-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="flex-1">
          <div className="bg-white rounded-lg flex items-center shadow-sm">
            <FaSearch className="text-gray-500 text-3xl ms-3" />
            <input
              type="text"
              placeholder="Ex. Doctor, Hospital"
              className="p-4 w-full rounded-lg text-gray-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Search Button */}
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg flex items-center gap-2 mt-2 md:mt-0 cursor-pointer">
          <FaSearch className="text-white" /> Search
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-8 text-sm text-gray-600">
        {/* Availability Filter */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("availability")} // Toggle availability dropdown
            className="flex items-center cursor-pointer"
          >
            Availability
            <FaChevronDown
              className={`ml-1 transition-transform ${
                activeMenu === "availability" ? "rotate-180" : ""
              }`}
            />
          </button>
          {renderDropdown("availability", [
            "Any",
            "Available Today",
            "Available Tomorrow",
            "Available This Week",
          ])}
        </div>

        {/* Other Filters */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("filter")} // Toggle filter dropdown
            className="flex items-center cursor-pointer"
          >
            Filter
            <FaChevronDown
              className={`ml-1 transition-transform ${
                activeMenu === "filter" ? "rotate-180" : ""
              }`}
            />
          </button>
          {renderDropdown("filter", [
            "All",
            "Free Consultation",
            "Online Payment",
            "Top Rated",
          ])}
        </div>

        {/* Sort By */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("sortBy")} // Toggle sort-by dropdown
            className="flex items-center cursor-pointer"
          >
            Sort By
            <FaChevronDown
              className={`ml-1 transition-transform ${
                activeMenu === "sortBy" ? "rotate-180" : ""
              }`}
            />
          </button>
          {renderDropdown("sortBy", [
            "Relevance",
            "Rating",
            "Price Low to High",
            "Price High to Low",
          ])}
        </div>
      </div>
    </div>
  );
}