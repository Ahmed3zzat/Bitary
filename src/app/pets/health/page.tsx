"use client";
import { useState } from "react";
import {
  FaCamera,
  FaBirthdayCake,
  FaPaw,
  FaArrowRight,
  FaDog,
  FaCat,
  FaMars,
  FaVenus,
} from "react-icons/fa";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import petPlaceholder from "@/assets/images/Photo (PLACE IMAGE INSIDE).png";
import { Pet } from "@/types/pet.type";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { createPet } from "@/store/Features/user.pets";
import Link from "next/link";
import { FiEye } from "react-icons/fi";

export default function PetProfile() {
  const { user } = useAppSelector((state) => state.profileSlice);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { isError, isLoading } = useAppSelector((state) => state.petSlice);

  const validationSchema = Yup.object<Pet>().shape({
    petName: Yup.string()
      .required("Pet name is required")
      .max(20, "Name must be 20 characters or less"),
    color: Yup.string().required("Color is required"),
    birthDate: Yup.date()
      .required("Birthdate is required")
      .max(new Date(), "Birthdate cannot be in the future"),
    gender: Yup.number().required("Gender is required"),
    type: Yup.number().required("Pet type is required"),
    avatar: Yup.mixed().required("Pet photo is required"),
    // avatar: Yup.mixed<File>()
    //   .required("Pet photo is required")
    //   .test("fileSize", "File too large (max 2MB)", (value) => {
    //     if (!value) return false;
    //     return value.size <= 2000000;
    //   })
    //   .test(
    //     "fileType",
    //     "Unsupported format (JPEG, PNG, WebP only)",
    //     (value) => {
    //       if (!value) return false;
    //       return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
    //     }
    //   ),
  });

  const formik = useFormik({
    initialValues: {
      petName: "",
      color: "#ffb6c1", // Default to light pink
      birthDate: "",
      gender: 0,
      type: 0,
      avatar: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(createPet(values));
        formik.resetForm();
        setPreviewImage(null);
      } catch (error) {
        console.error("Failed to create pet:", error);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];
      formik.setFieldValue("avatar", file.name);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreviewImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/pets"
          className="group inline-flex items-center gap-2 mb-8 px-5 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FiEye className="text-green-600 group-hover:text-green-700 transition-colors" />
          <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
            View Your Pets
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full"></div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-white mb-2 relative"
            >
              Create Pet Profile
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-lg relative"
            >
              Tell us about your {user?.firstName} companion
            </motion.p>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
            {/* Pet Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                  <Image
                    src={previewImage || petPlaceholder}
                    alt="Pet preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300 rounded-full flex items-center justify-center">
                    <FaCamera className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <label className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-green-50 transition-all duration-300">
                  <FaCamera className="text-green-600 text-lg" />
                  <input
                    placeholder="enter your image"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    onBlur={formik.handleBlur}
                    className="hidden"
                  />
                </label>
              </div>
              {formik.touched.avatar && formik.errors.avatar && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.avatar}
                </p>
              )}
            </div>

            {/* Pet Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pet{"'"}s Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="petName"
                  placeholder="e.g. Max, Bella, Luna"
                  value={formik.values.petName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-3 pl-10 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <FaPaw className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              {formik.touched.petName && formik.errors.petName && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.petName}
                </p>
              )}
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("gender", 1)}
                  className={`p-4 rounded-xl border-2 flex items-center justify-center space-x-2 transition-all ${
                    formik.values.gender === 1
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FaMars className="text-lg" />
                  <span>Male</span>
                </button>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("gender", 2)}
                  className={`p-4 rounded-xl border-2 flex items-center justify-center space-x-2 transition-all ${
                    formik.values.gender === 2
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FaVenus className="text-lg" />
                  <span>Female</span>
                </button>
              </div>
              {formik.touched.gender && formik.errors.gender && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.gender}
                </p>
              )}
            </div>

            {/* Pet Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("type", 1)}
                  className={`p-4 rounded-xl border-2 flex items-center justify-center space-x-2 transition-all ${
                    formik.values.type === 1
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FaDog className="text-lg" />
                  <span>Dog</span>
                </button>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("type", 2)}
                  className={`p-4 rounded-xl border-2 flex items-center justify-center space-x-2 transition-all ${
                    formik.values.type === 2
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FaCat className="text-lg" />
                  <span>Cat</span>
                </button>
              </div>
              {formik.touched.type && formik.errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.type}
                </p>
              )}
            </div>

            {/* Birthdate */}
            <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-50 rounded-lg">
                  <FaBirthdayCake className="text-green-500 text-xl" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birthday
                  </label>
                  <input
                    placeholder="birthday"
                    name="birthDate"
                    type="date"
                    value={formik.values.birthDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
              {formik.touched.birthDate && formik.errors.birthDate && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.birthDate}
                </p>
              )}
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fur Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  placeholder="color"
                  type="color"
                  name="color"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.color}
                  className="w-12 h-12 rounded-lg cursor-pointer border border-gray-200"
                />
                <span className="text-sm text-gray-600">
                  {formik.values.color.toUpperCase()}
                </span>
              </div>
              {formik.touched.color && formik.errors.color && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.color}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty || isLoading}
              className={`w-full py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 ${
                !formik.isValid || !formik.dirty || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <span>Complete Profile</span>
                  <FaArrowRight />
                </>
              )}
            </button>

            {isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>Please check your data and try again</span>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
