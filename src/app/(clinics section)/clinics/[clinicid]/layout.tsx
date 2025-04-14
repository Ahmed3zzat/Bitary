
"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import doctorImage from "@/assets/images/doctorimg.jpg";
import Image from "next/image";
import { ReactNode } from "react";
import { FiCalendar, FiMapPin, FiStar, FiUser } from "react-icons/fi";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
  const { clinicid } = useParams();
  const clinicIdNumber: number = parseInt(clinicid as string, 10) - 1;
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
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 text-[15px] bg-gray-50">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <Link href={`/clinics/${clinicid}`}><Image
                      src={doctor.image}
                      width={200}
                      height={200}
                      className="object-cover rounded-2xl shadow-lg border-4 border-white transform transition duration-300 hover:scale-105"
                      alt={doctor.name}
                    /></Link>
                    <div className="absolute -bottom-3 -right-3 bg-white px-3 py-1 rounded-full shadow-md flex items-center">
                      <FiStar className="text-yellow-400 mr-1" />
                      <span className="font-bold text-gray-800">{doctor.rating}</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                  <Link href={`/clinics/${clinicid}`}><h1 className="text-3xl font-bold text-gray-800 leading-tight">
                      {doctor.name}
                    </h1></Link>
                    
                    <p className="text-green-700 font-semibold text-xl">
                      {doctor.clinic}
                    </p>
                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
        
                    <div className="flex flex-wrap gap-4 mt-3">
                      <p className="text-gray-600 flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
                        <FiMapPin className="text-green-600" /> {doctor.location}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
                        <FiUser className="text-green-600" /> {doctor.experience}
                      </p>
                      <p className="text-green-600 font-medium flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
                        <FiCalendar /> {doctor.available}
                      </p>
                    </div>
        
                    <div className="pt-2">
                      <div className="text-2xl font-bold text-gray-800">
                        EGP {doctor.fee}{" "}
                        <span className="text-sm text-gray-500 line-through">
                          EGP {doctor.originalFee}
                        </span>
                        <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          10% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
      {children}
    </div>
  )
}
