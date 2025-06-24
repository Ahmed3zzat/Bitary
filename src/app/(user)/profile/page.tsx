"use client";

import { JSX, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FiCheck, FiMapPin, FiUser } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "@/hooks/store.hook";
import { fetchUserData } from "@/store/Features/profile.slice";
import { IoIosCall } from "react-icons/io";
import axios from "axios";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const nameFields = [
  {
    name: "firstName",
    label: "First Name",
    icon: <FiUser className="text-green-600" />,
  },
  {
    name: "lastName",
    label: "Last Name",
    icon: <FiUser className="text-green-600" />,
  },
  {
    name: "phone",
    label: "Phone Number",
    icon: <IoIosCall className="text-green-600" />,
  },
];

const addressFields = [
  {
    name: "name",
    label: "Address Name",
    icon: <FiMapPin className="text-green-600" />,
  },
  {
    name: "street",
    label: "Street",
    icon: <FiMapPin className="text-green-600" />,
  },
  {
    name: "city",
    label: "City",
    icon: <FiMapPin className="text-green-600" />,
  },
  {
    name: "country",
    label: "Country",
    icon: <FiMapPin className="text-green-600" />,
  },
];

type FieldName =
  | (typeof nameFields)[number]["name"]
  | (typeof addressFields)[number]["name"];

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.profileSlice);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const isLoading = !user;

  const formik = useFormik<Record<FieldName | "gender", string>>({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phoneNumber || "",
      name: user?.address?.name || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      country: user?.address?.country || "",
      gender: user?.gender?.toString() || "1",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      phone: Yup.string()
        .required("Required")
        .matches(/^[0-9+()\s-]+$/, "Invalid phone number"),
      name: Yup.string().required("Required"),
      street: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      country: Yup.string().required("Required"),
      gender: Yup.string()
        .oneOf(["1", "2"], "Invalid gender")
        .required("Required"),
    }),

    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token not found.");
        }
        const apiUrl = `http://bitary.runasp.net/api/Authentication/UpdateUserInformation`;
        const requestBody = {
          firstName: values.firstName,
          lastName: values.lastName,
          gender: parseInt(values.gender, 10),
          address: {
            name: values.name,
            street: values.street,
            city: values.city,
            country: values.country,
          },
          phoneNumber: values.phone,
        };
        await axios.post(apiUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Profile updated successfully!");
        dispatch(fetchUserData());
      } catch (error) {
        console.error("Update failed:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    },
  });

  const renderGenderSelect = () => (
    <motion.div variants={itemVariants}>
      <label
        htmlFor="gender"
        className="block text-sm font-medium text-gray-800 mb-1"
      >
        Gender
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600">
          <FiUser />
        </div>
        <select
          id="gender"
          name="gender"
          value={formik.values.gender}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`pl-10 bg-white border ${
            formik.touched["gender"] && formik.errors["gender"]
              ? "border-red-500"
              : "border-gray-300"
          } text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 w-full p-2.5 transition-all duration-200 ease-in-out hover:border-green-400`}
        >
          <option value="1">Male</option>
          <option value="2">Female</option>
        </select>
        {formik.touched.gender && formik.errors.gender && (
          <p className="text-xs text-red-600 mt-1">{formik.errors.gender}</p>
        )}
      </div>
    </motion.div>
  );

  const renderInput = (name: FieldName, label: string, icon: JSX.Element) => (
    <motion.div key={name} variants={itemVariants}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-800 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
        <input
          id={name}
          name={name}
          type="text"
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`pl-10 bg-white border ${
            formik.touched[name] && formik.errors[name]
              ? "border-red-500"
              : "border-gray-300"
          } text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 w-full p-2.5 transition-all duration-200 ease-in-out hover:border-green-400`}
        />
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-xs text-red-600 mt-1"
        >
          {formik.errors[name]}
        </motion.p>
      )}
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
          className="w-12 h-12 rounded-full border-4 border-green-600 border-t-transparent"
        />

      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-[calc(100vh-5rem)] bg-gray-50 py-3 px-4 sm:px-6 lg:px-8 w-full"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold"
                >
                  Profile Settings
                </motion.h1>
                <motion.p 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-green-100 mt-2"
                >
                  Manage your personal information
                </motion.p>
              </div>
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-white/20 p-3 rounded-full backdrop-blur-sm"
              >
                <FiUser className="text-2xl" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <form onSubmit={formik.handleSubmit} className="p-6 md:p-8">
            {/* Personal Information Section */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-10"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200"
              >
                Personal Information
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nameFields.map((field) =>
                  renderInput(field.name, field.label, field.icon)
                )}
                {renderGenderSelect()}
              </div>
            </motion.div>

            {/* Address Section */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200"
              >
                Address Information
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addressFields.map((field) =>
                  renderInput(field.name, field.label, field.icon)
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <motion.button
                type="submit"
                disabled={!formik.isValid || !formik.dirty}
                whileHover={formik.isValid && formik.dirty ? { scale: 1.02 } : {}}
                whileTap={formik.isValid && formik.dirty ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition-all flex items-center justify-center ${
                  !formik.isValid || !formik.dirty
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-700 to-green-600 text-white hover:from-green-800 hover:to-green-700 shadow-md"
                }`}
              >
                <FiCheck className="mr-2" />
                Save Changes
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
