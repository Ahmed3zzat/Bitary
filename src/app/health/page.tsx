"use client";
import { useState } from "react";
import { FaCamera, FaBirthdayCake, FaPaw, FaArrowRight } from "react-icons/fa";
import imagePet from "@/assets/images/Photo (PLACE IMAGE INSIDE).png";
import Image from "next/image";
import Link from "next/link";

export default function PetProfile() {
  const [petName, setPetName] = useState("");
  const [petGender, setPetGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [adoptionDate, setAdoptionDate] = useState("");

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto bg-white rounded-2xl shadow-lg space-y-6 my-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Create Pet Profile</h1>
        <p className="text-gray-500 mt-2">
          Let{"'"}s get to know your furry friend
        </p>
      </div>

      {/* Pet Image Upload */}
      <div className="relative group">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-green-100 shadow-lg relative">
          <Image
            src={imagePet}
            alt="Pet"
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0  group-hover:bg-opacity-30 transition-all duration-300 rounded-full" />
        </div>
        <label className="absolute bottom-3 right-3 bg-white p-3 rounded-full shadow-md cursor-pointer hover:bg-green-50 transition-all duration-300 flex items-center justify-center">
          <FaCamera className="text-green-600 text-xl" />
          <input type="file" className="hidden" accept="image/*" />
        </label>
      </div>

      {/* Pet Name & Gender */}
      <div className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pet{"'"}s Name
          </label>
          <input
            type="text"
            placeholder="e.g. Max, Bella"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPetGender("male")}
              className={`p-3 rounded-xl border-2 ${
                petGender === "male"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              } transition-all`}
            >
              Male
            </button>
            <button
              onClick={() => setPetGender("female")}
              className={`p-3 rounded-xl border-2 ${
                petGender === "female"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              } transition-all`}
            >
              Female
            </button>
          </div>
        </div>
      </div>

      {/* Important Dates */}
      <div className="w-full space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Important Dates</h2>
        <p className="text-sm text-gray-500 -mt-2">
          Celebrate your pet{"'"}s milestones
        </p>

        <div className="space-y-3">
          <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FaBirthdayCake className="text-green-500 text-xl" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FaPaw className="text-green-500 text-xl" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adoption Day
                </label>
                <input
                  type="date"
                  value={adoptionDate}
                  onChange={(e) => setAdoptionDate(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col w-full space-y-3 mt-4">
        <Link href={"/health/wellness"} className="w-full bg-green-600 text-white py-3 px-6 rounded-xl shadow-md hover:bg-green-700 transition-all flex items-center justify-center space-x-2">
          <span>Save Profile</span>
          <FaArrowRight />
        </Link>

      </div>
    </div>
  );
}
