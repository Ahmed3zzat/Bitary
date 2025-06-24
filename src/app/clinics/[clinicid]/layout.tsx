"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import doctorImage from "@/assets/images/doctorBitary.jpg";
import Image from "next/image";
import { ReactNode } from "react";
import { FiMapPin, FiStar } from "react-icons/fi";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { getClinicById } from "@/store/Features/clinic.slice";
import Loading from "@/Components/Loading/loading";

export default function Layout({ children }: { children: ReactNode }) {
  const { clinicIdData, isLoading, isError } = useAppSelector(
    (state) => state.clinicSlice
  );
  const dispatch = useAppDispatch();
  const { clinicid } = useParams();

  useEffect(() => {
    if (clinicid) {
      dispatch(getClinicById(Number(clinicid)));
    }
  }, [clinicid, dispatch]);

  const currentClinic = clinicIdData;

  if (isLoading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
        <Loading />
      </div>
    );

  if (isError)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center max-w-md">
          <h3 className="text-red-600 font-medium text-lg">Error loading clinic</h3>
          <p className="text-red-500 mt-2">Please refresh or try again later</p>
        </div>
      </div>
    );

  if (!currentClinic)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center max-w-md">
          <h3 className="text-blue-600 font-medium text-lg">Clinic not found</h3>
          <p className="text-blue-500 mt-2">This clinic may no longer be available</p>
        </div>
      </div>
    );

  const doctor = {
    id: currentClinic.id,
    name: currentClinic.ownerName || "Veterinary Doctor",
    location: `${currentClinic.address?.street || ""}, ${currentClinic.address?.city || ""}`,
    clinic: currentClinic.clinicName || "Pet Care Clinic",
    fee: currentClinic.id * 20,
    originalFee: currentClinic.id * 22,
    rating: currentClinic.rating?.toString() || "4.5",
    image: doctorImage,
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Clinic Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-md">
          <div className="flex flex-col md:flex-row">
            {/* Doctor Image */}
            <div className="relative md:w-1/3 h-64 md:h-auto">
              <Link href={`/clinics/${clinicid}`} className="block h-full">
                <Image
                  src={doctor.image}
                  fill
                  className="object-cover w-full h-full"
                  alt={doctor.name}
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span className="font-bold text-gray-800">
                    {Number(doctor.rating).toFixed(1)}
                  </span>
                </div>
              </Link>
            </div>

            {/* Clinic Info */}
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full mb-3">
                  Veterinary Clinic
                </span>
                <Link href={`/clinics/${clinicid}`}>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {doctor.clinic}
                  </h1>
                </Link>
                <p className="text-green-700 font-semibold text-lg md:text-xl mt-2">
                  Dr. {doctor.name}
                </p>
              </div>

              <div className="mt-2 mb-6">
                <div className="flex items-center text-gray-600 text-sm bg-gray-50 px-3 py-1.5 rounded-full w-fit">
                  <FiMapPin className="text-green-600 mr-1.5" />
                  {doctor.location}
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                        {doctor.fee<450 ?     
                           <div className="flex items-baseline gap-2 mt-1">    
                               <span className="text-xl md:text-2xl font-bold text-gray-900">
                        EGP 550
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        EGP 550
                      </span> </div>:                   
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xl md:text-2xl font-bold text-gray-900"> EGP {doctor.fee}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        EGP {doctor.originalFee}
                      </span>
        
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}