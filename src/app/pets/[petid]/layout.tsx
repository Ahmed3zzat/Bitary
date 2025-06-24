"use client";

import { FaBirthdayCake, FaPaw, FaDog, FaEdit, FaStar, FaVenus, FaMars } from "react-icons/fa";
import Image from "next/image";
import petPlaceholder from "@/assets/images/Photo (PLACE IMAGE INSIDE).png";
import dogImageCard from "@/assets/images/dogType.jpg";
import catImageCard from "@/assets/images/catType.jpg";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { getPetId } from "@/store/Features/user.pets";
import { Pet } from "@/types/pet.type";

export default function PetProfile({ children }: { children: ReactNode }) {
  const path = usePathname();
  const params = useParams();
  const petid = params.petid as string;
  const dispatch = useAppDispatch();
  
  const { PetList, isLoading } = useAppSelector((state) => state.petSlice);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        await dispatch(getPetId(Number(petid)));
      } catch (err) {
        setError("Could not load pet information");
        console.error(err);
      }
    };

    if (petid) {
      fetchPetData();
    }
  }, [petid, dispatch]);

  // Get pet from the Redux store
  const pet = PetList && Array.isArray(PetList) 
    ? PetList.find(p => p.id === Number(petid))
    : (PetList as Pet | null);

  // Calculate age from birthDate
  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Map pet type to breed name
  const getPetType = (type: number) => {
    switch(type) {
      case 1: return "Dog";
      case 2: return "Cat";
    }
  };

  if (path === "/pets/health") {
    return <div className="mt-4 md:mt-6">{children}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 p-4 md:p-6 min-h-[calc(100vh-4.5rem)] gap-4 md:gap-8">
      <div className="w-full lg:w-1/3 bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="bg-gray-300 h-24 w-24 rounded-full"></div>
                <div className="w-full">
                  <div className="h-7 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-20 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-40 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-60 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : pet && (
          <>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-6 text-white relative">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white shadow-md overflow-hidden">
                    <Image
                      src={
                        pet.type === 1 
                          ? dogImageCard 
                          : pet.type === 2 
                            ? catImageCard 
                            : petPlaceholder}
                      alt={pet.petName}
                      fill
                      sizes="96px"
                      className="rounded-full object-cover"
                    />
                    {pet.color && (
                      <div 
                        className="absolute bottom-0 right-0 h-5 w-5 border-2 border-white rounded-full"
                        style={{ backgroundColor: pet.color }}
                        title="Pet's color"
                      />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white p-1.5 sm:p-2 rounded-full shadow-md transform translate-y-1/4 group-hover:translate-y-0 transition-transform duration-200">
                    <FaEdit className="text-green-600 text-base sm:text-lg cursor-pointer" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold">{pet.petName}</h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <FaDog className="text-green-200" />
                    <span className="text-green-100">{getPetType(pet.type)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FaPaw className="text-green-500" />
                  Appearance
                </h3>
                <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                  <div 
                    className="h-6 w-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: pet.color }}
                  ></div>
                  <p className="text-gray-600 text-xs md:text-sm">
                    Pet Fur Color
                  </p>
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                  Characteristics
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  <li className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-500 text-sm md:text-base">
                      Gender
                    </span>
                    <div className="flex items-center gap-2">
                      {pet.gender === 1 ? (
                        <FaMars className="text-blue-500" />
                      ) : (
                        <FaVenus className="text-pink-500" />
                      )}
                      <span className="font-medium text-sm md:text-base">
                        {pet.gender === 1 ? 'Male' : 'Female'}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaStar className="text-green-500" />
                  Important Dates
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between bg-green-50 p-2 md:p-3 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="bg-green-100 p-1.5 md:p-2 rounded-full">
                        <FaBirthdayCake className="text-green-600 text-sm md:text-base" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Birthday
                        </p>
                        <p className="font-medium text-sm md:text-base">
                          {formatDate(pet.birthDate)}
                        </p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs md:text-sm">
                      {getAge(pet.birthDate)} years
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-full lg:w-2/3 lg:ml-0">
        <div className="flex border-b border-gray-200">
          <Link
            href={`/pets/${petid}/appointments`}
            className={`flex-1 py-2 md:py-3 px-3 md:px-4 font-medium text-center text-sm md:text-base ${
              path.includes(`/pets/${petid}/appointments`)
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            } transition-colors`}
          >
            Appointments
          </Link>
          <Link
            href={`/pets/${petid}/medicalrecords`}
            className={`flex-1 py-2 md:py-3 px-3 md:px-4 font-medium text-center text-sm md:text-base ${
              path.includes(`/pets/${petid}/medicalrecords`)
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            } transition-colors`}
          >
            Medical Records
          </Link>
        </div>

        <div className="mt-4 md:mt-6">{children}</div>
      </div>
    </div>
  );
}

