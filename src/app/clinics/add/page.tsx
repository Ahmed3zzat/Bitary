"use client";
import { useState } from "react";
import {
  FaCamera,
  FaClinicMedical,
  FaArrowRight,
  FaCity,
  FaHome,
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaFlag,
} from "react-icons/fa";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import clinicPlaceholder from "@/assets/images/clinic.jpg";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import Link from "next/link";
import { FiEye, FiUpload } from "react-icons/fi";
import { createClinic } from "@/store/Features/clinic.slice";

export default function ClinicProfile() {
  const { user } = useAppSelector((state) => state.profileSlice);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { isError, isLoading } = useAppSelector((state) => state.clinicSlice);

  const validationSchema = Yup.object().shape({
    clinicName: Yup.string()
      .required("Clinic name is required")
      .max(50, "Name must be 50 characters or less"),
    address: Yup.object().shape({
      name: Yup.string().required("Address name is required"),
      street: Yup.string().required("Street is required"),
      city: Yup.string().required("City is required"),
      country: Yup.string().required("Country is required"),
    }),
    avatar: Yup.mixed().required("Clinic photo is required"),
  });

  const formik = useFormik({
    initialValues: {
      clinicName: "",
      address: {
        name: "",
        street: "",
        city: "",
        country: "",
      },
      avatar: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const submitData = {
          clinicName: values.clinicName,
          address: {
            name: values.address.name,
            street: values.address.street,
            city: values.address.city,
            country: values.address.country,
          },
        };
        dispatch(createClinic(submitData));
        formik.resetForm();
        setPreviewImage(null);
      } catch (error) {
        console.error("Failed to create clinic:", error);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];
      formik.setFieldValue("avatar", file);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/clinics/view/myclinic"
          className="group inline-flex items-center gap-2 mb-8 px-5 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          <FiEye className="text-green-600 group-hover:text-green-700 transition-colors" />
          <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
            View Your Clinics
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-indigo-700 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-[length:100px_100px] opacity-10"></div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full"></div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-white mb-2 relative"
            >
              Register Your Clinic
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-lg relative"
            >
              Tell us about your Clinic Dr. {user?.firstName} {user?.lastName}
            </motion.p>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-6 space-y-8">
            {/* Clinic Image Upload */}
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className="w-40 h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg relative">
                  <Image
                    src={previewImage || clinicPlaceholder}
                    alt="Clinic preview"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300 rounded-xl flex items-center justify-center">
                    <FiUpload className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <label className="absolute -bottom-3 -right-3 bg-white p-3 rounded-full shadow-md cursor-pointer hover:bg-green-50 transition-all duration-300 group">
                  <FaCamera className="text-green-600 text-lg group-hover:scale-110 transition-transform" />
                  <input
                    placeholder="ph"
                    name="avatar"
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleImageChange}
                    onBlur={formik.handleBlur}
                    className="hidden"
                  />
                </label>
              </motion.div>
              {formik.touched.avatar && formik.errors.avatar && (
                <p className="mt-2 text-sm text-red-600 text-center">
                  {formik.errors.avatar}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Clinic Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaClinicMedical className="mr-2 text-green-500" />
                  Clinic Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="clinicName"
                    placeholder="e.g. City Pet Hospital, Animal Care Center"
                    value={formik.values.clinicName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-3 pl-10 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                  <FaClinicMedical className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                {formik.touched.clinicName && formik.errors.clinicName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.clinicName}
                  </p>
                )}
              </div>

              {/* Address Section */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaMapMarkerAlt className="text-green-500 mr-2" />
                  Clinic Address
                </h3>

                {/* Address Name */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaBuilding className="mr-2 text-green-500" />
                    Address Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address.name"
                      placeholder="e.g. Main Office, Branch Location"
                      value={formik.values.address.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-3 pl-10 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <FaBuilding className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                  {formik.touched.address?.name &&
                    formik.errors.address?.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.address.name}
                      </p>
                    )}
                </div>

                {/* Street */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaHome className="mr-2 text-green-500" />
                    Street Address *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address.street"
                      placeholder="e.g. 123 Main Street"
                      value={formik.values.address.street}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-3 pl-10 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <FaHome className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                  {formik.touched.address?.street &&
                    formik.errors.address?.street && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.address.street}
                      </p>
                    )}
                </div>

                {/* City */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaCity className="mr-2 text-green-500" />
                    City *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address.city"
                      placeholder="e.g. New York, London"
                      value={formik.values.address.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-3 pl-10 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <FaCity className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                  {formik.touched.address?.city &&
                    formik.errors.address?.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.address.city}
                      </p>
                    )}
                </div>
                {/* Country */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaFlag className="mr-2 text-green-500" />
                    Country
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address.country"
                      placeholder="e.g. United States, United Kingdom"
                      value={formik.values.address.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-3 pl-10 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <FaGlobe className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                  {formik.touched.address?.country &&
                    formik.errors.address?.country && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.address.country}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={!formik.isValid || !formik.dirty || isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 ${
                  !formik.isValid || !formik.dirty || isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-indigo-700 text-white hover:from-green-700 hover:to-indigo-800"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    <span className="font-medium">Registering Clinic...</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">Complete Registration</span>
                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>

              {isError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
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
                    <span>
                      Registration failed. Please check your data and try again.
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}