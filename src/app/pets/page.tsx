"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import {
  deletePetId,
  getUserPets,
  updatePetId,
} from "@/store/Features/user.pets";
import Loading from "@/Components/Loading/loading";
import {
  FaDog,
  FaCat,
  FaVenus,
  FaMars,
  FaEdit,
  FaTrash,
  FaPlus,
  FaHeart,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dogImageCard from "@/assets/images/dogType.jpg";
import catImageCard from "@/assets/images/catType.jpg";
import { Pet } from "@/types/pet.type";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Pets() {
  const dispatch = useAppDispatch();
  const { PetList, isError, isLoading } = useAppSelector(
    (state) => state.petSlice
  );
  const { user } = useAppSelector((state) => state.profileSlice);
  const [editingPet, setEditingPet] = useState(0);

  useEffect(() => {
    dispatch(getUserPets());
  }, [dispatch]);

  const handleDelete = async (petId: number) => {
    if (confirm("Are you sure you want to delete this pet?")) {
      await dispatch(deletePetId(petId));
      dispatch(getUserPets());
    }
  };

  const petSchema = Yup.object().shape({
    petName: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .required("Name is required"),
    type: Yup.number()
      .oneOf([1, 2], "Invalid pet type")
      .required("Type is required"),
    gender: Yup.number()
      .oneOf([1, 2], "Invalid gender")
      .required("Gender is required"),
    birthDate: Yup.date()
      .max(new Date(), "Birth date cannot be in the future")
      .required("Birth date is required"),
    color: Yup.string().required("Color is required"),
    avatar: Yup.mixed().required("Pet photo is required"),
  });

  const handleEditClick = (pet: Pet) => {
    if (pet.id) {
      setEditingPet(pet.id);
    }
    formik.setValues({
      petName: pet.petName,
      type: pet.type,
      gender: pet.gender,
      birthDate: pet.birthDate.split("T")[0],
      color: pet.color,
      avatar: pet.avatar || null, // Keep existing avatar or set to null
    });
  };

  const handleCancelEdit = () => {
    setEditingPet(0);
    formik.resetForm();
  };

  interface FormValues {
    petName: string;
    type: number;
    gender: number;
    birthDate: string;
    color: string;
    avatar: string | File | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      petName: "",
      type: 1,
      gender: 1,
      birthDate: "",
      color: "#ffb6c1",
      avatar: null,
    },
    validationSchema: petSchema,
    onSubmit: async (values) => {
      formik.setFieldValue("petName", values.petName);
      formik.setFieldValue("type", values.type);
      formik.setFieldValue("gender", Number(values.gender));
      formik.setFieldValue("birthDate", values.birthDate);
      formik.setFieldValue("color", values.color);
      // Only append avatar if it's a File (new upload)
      if (values.avatar) {
        formik.setFieldValue("avatar", values.avatar);
        console.log(values.avatar);
      }
      // console.log(formik.values);
      // console.log(editingPet);
      await dispatch(
        updatePetId({
          values,
          petId: editingPet,
        })
      );

      dispatch(getUserPets());
      setEditingPet(0);
    },
  });

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-8 text-center bg-white rounded-xl shadow-lg">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <FaHeart className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">
            We couldn{"'"}t load your pets. Please try again.
          </p>
          <button
            onClick={() => dispatch(getUserPets())}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Your {user?.firstName } Family
            </h1>
            <p className="text-gray-500 mt-2">
              All your pets in one place, Mr. {user?.firstName}
            </p>
          </div>
          <Link
            href="/pets/health"
            className="mt-4 sm:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
          >
            <FaPlus className="text-lg" />
            <span>Add New Pet</span>
          </Link>
        </motion.div>

        {/* Pet Cards Grid */}
        {PetList && PetList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm"
          >
            <div className="w-32 h-32 mb-6 bg-blue-50 rounded-full flex items-center justify-center">
              <FaDog className="text-blue-400 text-5xl mr-2" />
              <FaCat className="text-yellow-400 text-4xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No Pets Yet
            </h2>
            <p className="text-gray-500 mb-6 max-w-md text-center">
              Your {user?.firstName } { user?.lastName} friends will appear here once you add them to your
              profile
            </p>
            <Link
              href="/pets/health"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              <FaPlus />
              <span>Add Your First Pet</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {PetList &&
                PetList.map((pet) => (
                  <motion.div
                    key={pet.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {editingPet === pet.id ? (
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            Edit {pet.petName}
                          </h3>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-gray-500 hover:text-gray-700"
                          >
                            {""}
                            <FaTimes />
                          </button>
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                          <div className="mb-4">
                            <label
                              htmlFor="petName"
                              className="block text-gray-700 text-sm font-medium mb-2"
                            >
                              Pet Name
                            </label>
                            <input
                              id="petName"
                              name="petName"
                              type="text"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.petName}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                formik.touched.petName && formik.errors.petName
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:ring-blue-500"
                              }`}
                            />
                            {formik.touched.petName &&
                              formik.errors.petName && (
                                <p className="mt-1 text-sm text-red-600">
                                  {formik.errors.petName}
                                </p>
                              )}
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="type"
                              className="block text-gray-700 text-sm font-medium mb-2"
                            >
                              Type
                            </label>
                            <select
                              id="type"
                              name="type"
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "type",
                                  parseInt(e.target.value)
                                );
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.type}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                formik.touched.type && formik.errors.type
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:ring-blue-500"
                              }`}
                            >
                              <option value={1}>Dog</option>
                              <option value={2}>Cat</option>
                            </select>
                            {formik.touched.type && formik.errors.type && (
                              <p className="mt-1 text-sm text-red-600">
                                {formik.errors.type}
                              </p>
                            )}
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="gender"
                              className="block text-gray-700 text-sm font-medium mb-2"
                            >
                              Gender
                            </label>
                            <select
                              id="gender"
                              name="gender"
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "gender",
                                  parseInt(e.target.value)
                                );
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.gender}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                formik.touched.gender && formik.errors.gender
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:ring-blue-500"
                              }`}
                            >
                              <option value={1}>Male</option>
                              <option value={2}>Female</option>
                            </select>
                            {formik.touched.gender && formik.errors.gender && (
                              <p className="mt-1 text-sm text-red-600">
                                {formik.errors.gender}
                              </p>
                            )}
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="birthDate"
                              className="block text-gray-700 text-sm font-medium mb-2"
                            >
                              Birth Date
                            </label>
                            <input
                              id="birthDate"
                              name="birthDate"
                              type="date"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.birthDate}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                formik.touched.birthDate &&
                                formik.errors.birthDate
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:ring-blue-500"
                              }`}
                            />
                            {formik.touched.birthDate &&
                              formik.errors.birthDate && (
                                <p className="mt-1 text-sm text-red-600">
                                  {formik.errors.birthDate}
                                </p>
                              )}
                          </div>

                          <div className="flex justify-end space-x-3 mt-6">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={formik.isSubmitting || !formik.isValid}
                              className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                formik.isSubmitting || !formik.isValid
                                  ? "bg-blue-400 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                            >
                              {formik.isSubmitting
                                ? "Saving..."
                                : "Save Changes"}
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <>
                        {/* Pet Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={pet.type === 1 ? dogImageCard : catImageCard}
                            alt={pet.petName}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute top-4 right-4 flex space-x-2">
                            <button
                              onClick={() => handleEditClick(pet)}
                              className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-blue-600 hover:bg-white transition-all shadow-sm"
                              aria-label="Edit pet"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => {
                                if (pet.id) {
                                  handleDelete(pet.id);
                                }
                              }}
                              className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-red-600 hover:bg-white transition-all shadow-sm"
                              aria-label="Delete pet"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                          <span
                            className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
                              pet.type === 1
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {pet.type === 1 ? "Dog" : "Cat"}
                          </span>
                        </div>

                        {/* Pet Info */}
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                {pet.petName}
                                {pet.gender === 1 ? (
                                  <FaMars className="text-blue-400 text-base" />
                                ) : (
                                  <FaVenus className="text-pink-400 text-base" />
                                )}
                              </h3>
                              <p className="text-gray-500 mt-1">
                                Born{" "}
                                {new Date(pet.birthDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                            <div className="text-2xl">
                              {pet.type === 1 ? (
                                <FaDog className="text-blue-400" />
                              ) : (
                                <FaCat className="text-yellow-400" />
                              )}
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                ID: {pet.id}
                              </span>
                              <Link
                                href={`/pets/${pet.id}/appointments`}
                                className="text-blue-500 hover:text-blue-600 font-medium"
                              >
                                View Details →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
