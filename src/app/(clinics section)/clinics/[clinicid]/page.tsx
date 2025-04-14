"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import doctorImage from "@/assets/images/doctorimg.jpg";

// React Icons
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiStar,
  FiUser,
  FiThumbsUp,
  FiAward,
} from "react-icons/fi";

export default function ClinicsId() {
  const { clinicid } = useParams();
  const clinicIdNumber: number = parseInt(clinicid as string, 10) - 1;
  const [selectedDate, setSelectedDate] = useState("5");
  const [selectedTime, setSelectedTime] = useState("9:00 AM");

  const days = [
    { day: "Sun", date: "3" },
    { day: "Mon", date: "4" },
    { day: "Tue", date: "5" },
    { day: "Wed", date: "6" },
    { day: "Thu", date: "7" },
    { day: "Fri", date: "8" },
    { day: "Sat", date: "9" },
    { day: "Sun", date: "10" },
  ];

  const times = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
  ];

  const doctors = useMemo(
    () => [
      {
        id: 1,
        name: "Dr. Ahmed Samy",
        gender: "male", // Added gender property
        experience: "16 years experience overall",
        location: "Maadi, Cairo",
        clinic: "Pet Care Specialist",
        specialty: "Veterinary Cardiology",
        fee: "450",
        originalFee: "500",
        rating: "4.8",
        reviews: "120",
        available: "Available Today",
        image: doctorImage,
        education: "PhD in Veterinary Medicine, Cairo University",
        awards: ["Best Vet 2022", "Pet Lovers Choice Award 2021"],
        languages: ["English", "Arabic"],
      },
      {
        id: 2,
        name: "Dr. Mohamed Ali",
        gender: "male", // Added gender property
        experience: "12 years experience overall",
        location: "Madinet Nasr, Cairo",
        clinic: "Pet Care Specialist",
        specialty: "Veterinary Surgery",
        fee: "450",
        originalFee: "500",
        rating: "4.9",
        reviews: "120",
        available: "Available Tomorrow",
        image: doctorImage,
        education: "MSc in Veterinary Surgery, Alexandria University",
        awards: ["Golden Paw Award 2023"],
        languages: ["English", "Arabic"],
      },
      {
        id: 3,
        name: "Dr. Ali Hassan",
        gender: "male", // Added gender property
        experience: "14 years experience overall",
        location: "Mohandessin, Giza",
        clinic: "Pet Care Specialist",
        specialty: "Veterinary Dermatology",
        fee: "450",
        originalFee: "500",
        rating: "4.7",
        reviews: "120",
        available: "Available This Week",
        image: doctorImage,
        education: "Board Certified Veterinary Dermatologist",
        awards: ["Excellence in Pet Care 2020"],
        languages: ["English", "Arabic", "French"],
      },
    ],
    []
  );

  const doctor = doctors[clinicIdNumber];

  return (
    <div className="">
      {/* Stats with hover effects */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-green-200 hover:scale-105 duration-300" >
          <div className="text-2xl font-bold text-green-600 flex justify-center items-center gap-2">
            <FiUser /> 116+
          </div>
          <div className="text-gray-500 mt-1 text-sm text-center">Patients</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-green-200 hover:scale-105 duration-300" >
          <div className="text-2xl font-bold text-green-600 flex justify-center items-center gap-2">
            <FiClock /> 16
          </div>
          <div className="text-gray-500 mt-1 text-sm text-center">
            Years Exp
          </div>
        </div>
        <Link
          href={`/clinics/${clinicid}/reviews`}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-green-200 hover:scale-105 duration-300" 
        >
          <div className="text-2xl font-bold text-green-600 flex justify-center items-center gap-2">
            <FiStar /> {doctor.rating}
          </div>
          <div className="text-gray-500 mt-1 text-sm text-center">Rating</div>
        </Link>
        <Link
          href={`/clinics/${clinicid}/reviews`}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-green-200 hover:scale-110 duration-300" 
        >
          <div className="text-2xl font-bold text-green-600 flex justify-center items-center gap-2">
            <FiThumbsUp /> {doctor.reviews}
          </div>
          <div className="text-gray-500 mt-1 text-sm text-center">Reviews</div>
        </Link>
      </div>

      {/* About and Details in two columns */}
      <div className="grid md:grid-cols-1 gap-6">
        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">
            About Dr. {doctor.name.split(" ")[2]}
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            {doctor.name} is a renowned {doctor.specialty.toLowerCase()} with
            over {doctor.experience}.{" "}
            {doctor.gender === "female" ? "She" : "He"} completed{" "}
            {doctor.education} and has been providing exceptional care to pets
            in the {doctor.location} area.
          </p>
          <p className="text-gray-600 leading-relaxed">
            With a legacy of compassionate care and numerous awards,{" "}
            {doctor.gender === "female" ? "she" : "he"} has made a significant
            impact in the lives of hundreds of pets and their owners.{" "}
            {doctor.gender === "female" ? "Her" : "His"} approach combines the
            latest medical techniques with genuine love for animals.
          </p>

          {/* Education */}
          <div className="mt-5">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <FiAward className="text-green-600" /> Education
            </h4>
            <p className="text-gray-600 mt-1 text-sm">{doctor.education}</p>
          </div>

          {/* Languages */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <FiUser className="text-green-600" /> Languages
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {doctor.languages.map((lang) => (
                <span
                  key={lang}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {lang}
                </span>
              ))}
            </div>
            {/* Clinic Information */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Clinic Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FiMapPin className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Location</h4>
                    <p className="text-gray-500 text-sm">{doctor.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FiClock className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Availability</h4>
                    <p className="text-gray-500 text-sm">{doctor.available}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            Book an Appointment
          </h3>
        </div>

        {/* Date Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiCalendar className="text-green-600" /> Select Date
          </h4>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {days.map(({ day, date }) => (
              <div
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`text-center px-3 py-2 rounded-lg border font-medium text-sm cursor-pointer transition-all
                ${
                  selectedDate === date
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md transform scale-105"
                    : "text-gray-700 border-gray-200 bg-gray-50 hover:bg-green-50 hover:border-green-200"
                }`}
              >
                <div
                  className={`font-medium ${
                    selectedDate === date ? "text-white" : "text-gray-600"
                  }`}
                >
                  {day}
                </div>
                <div
                  className={`text-xs ${
                    selectedDate === date ? "text-white" : "text-gray-500"
                  }`}
                >
                  {date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiClock className="text-green-600" /> Select Time
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
                ${
                  selectedTime === time
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md transform scale-105"
                    : "text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-200 cursor-pointer"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Button */}
        <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-lg font-semibold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2">
          Confirm Appointment for {selectedDate} at {selectedTime}
        </button>

        {/* Consultation Info */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Consultation fee: EGP {doctor.fee} (10% discount applied)</p>
          <p className="mt-1">
            Cancellation policy: Free cancellation up to 24 hours before
            appointment
          </p>
        </div>
      </div>
    </div>
  );
}
