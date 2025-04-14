"use client";

import ClinicsFilter from "@/Components/ClinicsFilter/ClinicsFilter";
import DoctorCard from "@/Components/DoctorCard/DoctorCard";
import { useState, useMemo } from "react";
import doctorImage from "@/assets/images/doctorimg.jpg";
export default function DoctorsPage() {
  const [availability, setAvailability] = useState("Any");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Relevance");

  // Static list of doctors (mock data)
  const doctors = useMemo(() => [
    {
      id: 1,
      name: "Ahmed",
      experience: "16 years experience overall",
      location: "Maadi, Cairo",
      clinic: "Pet Care",
      fee: "450",
      originalFee: "500",
      rating: "70",
      reviews: "120",
      available: "Available Today",
      image: doctorImage,
    },
    {
      id: 2,
      name: "Mohamed",
      experience: "16 years experience overall",
      location: "Madinet Nasr, Cairo",
      clinic: "Pet Care",
      fee: "450",
      originalFee: "500",
      rating: "90",
      reviews: "120",
      available: "Available Tomorrow",
      image: doctorImage,
    },
    {
      id: 3,
      name: "Ali",
      experience: "16 years experience overall",
      location: "Mohandessin, Giza",
      clinic: "Pet Care",
      fee: "450",
      originalFee: "500",
      rating: "85",
      reviews: "120",
      available: "Available This Week",
      image: doctorImage,
    },
  ], []);

  // Apply filtering and sorting based on user selection
  const filteredDoctors = useMemo(() => {
    let result = [...doctors];

    // Filter by availability (unless "Any" is selected)
    if (availability !== "Any") {
      result = result.filter((doc) => doc.available === availability);
    }

    // Apply custom filters
    switch (filter) {
      case "Free Consultation":
        result = result.filter((doc) => doc.fee === "0");
        break;
      case "Top Rated":
        result = result.filter((doc) => parseInt(doc.rating) >= 85);
        break;
    }

    // Apply sorting logic
    switch (sortBy) {
      case "Rating":
        result.sort((a, b) => parseInt(b.rating) - parseInt(a.rating));
        break;
      case "Price Low to High":
        result.sort((a, b) => parseInt(a.fee) - parseInt(b.fee));
        break;
      case "Price High to Low":
        result.sort((a, b) => parseInt(b.fee) - parseInt(a.fee));
        break;
    }

    return result;
  }, [availability, filter, sortBy, doctors]);

  return (
    <div className="lg:container lg:mx-auto mx-3 overflow-hidden">
      {/* Filter controls */}
      <ClinicsFilter
        setAvailability={setAvailability}
        setFilter={setFilter}
        setSortBy={setSortBy}
      />

      {/* Doctor count and description */}
      <h2 className="text-xl font-semibold mb-1">
        {filteredDoctors.length} doctors available
      </h2>
      <p className="text-gray-500 mb-5 flex items-center gap-1">
        Book appointments with minimum wait-time & verified doctor details
      </p>

      {/* Doctor list */}
      {filteredDoctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={{ ...doctor, image: doctor.image.src }} />
      ))}
    </div>
  );
}
