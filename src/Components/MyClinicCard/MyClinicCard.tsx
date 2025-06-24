"use client";
import Image from "next/image";
import {
  BsStarFill,
  BsGeoAlt,
  BsPencilSquare,
  BsTrash,
  BsCheckCircle,
  BsXCircle,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { FiClock, FiPlusCircle } from "react-icons/fi";
import clinic1 from "@/assets/images/clinicCover1.jpg";
import clinic2 from "@/assets/images/clinicCover2.jpg";
import Link from "next/link";
import { Clinic, ClinicUpdate } from "@/types/clinic.type";
import { motion } from "framer-motion";
import {
  delteClinicById,
  getClinic,
  updateClinicById,
  updateClinicByAdmin,
  addDoctorToClinic,
} from "@/store/Features/clinic.slice";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { Fragment } from "react";
import { fadeIn, staggerContainer } from "../ClinicCard/motion";
import Modal from "../ClinicCard/Modal";

const getClinicImage = (index: number) => (index % 2 === 0 ? clinic2 : clinic1);

const clinicSchema = Yup.object().shape({
  clinicName: Yup.string().required("Clinic name is required"),
  address: Yup.object().shape({
    name: Yup.string().required("Address name is required"),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
  }),
});

const doctorIdSchema = Yup.object().shape({
  doctorId: Yup.number()
    .required("Doctor ID is required")
    .positive("Must be a positive number")
    .integer("Must be an integer"),
});

const getInitialValues = (clinic: Clinic) => ({
  clinicName: clinic.clinicName,
  address: {
    name: clinic.address?.name || "",
    street: clinic.address?.street || "",
    city: clinic.address?.city || "",
    country: clinic.address?.country || "",
  },
});

const ClinicStatusBadge = ({ status }: { status: number }) => {
  const statusConfig = {
    0: {
      text: "Pending Review",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: <FiClock className="mr-1" />,
    },
    1: {
      text: "Approved",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      icon: <BsCheckCircle className="mr-1" />,
    },
    2: {
      text: "Rejected",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: <BsXCircle className="mr-1" />,
    },
  };

  const currentStatus =
    statusConfig[status as keyof typeof statusConfig] || statusConfig[0];

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.bgColor} ${currentStatus.textColor}`}
    >
      {currentStatus.icon}
      {currentStatus.text}
    </motion.span>
  );
};

const StatusUpdateMenu = ({ clinicId }: { clinicId: number }) => {
  const dispatch = useAppDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminRole, setAdminRole] = useState<number | null>(null);
  const { user } = useAppSelector((state) => state.userSlice);

  useEffect(() => {
    setAdminRole(user ? Number(user) : null);
  }, [user]);

  const handleStatusUpdate = async (newStatus: number) => {
    if (adminRole !== 2) {
      toast.error("❌ Only admins can update clinic status");
      return;
    }

    try {
      setIsUpdating(true);
      await dispatch(
        updateClinicByAdmin({
          status: newStatus,
          ClinicId: clinicId,
        })
      ).unwrap();
      dispatch(getClinic());
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (adminRole !== 2) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="inline-flex justify-center w-full p-2 text-sm font-medium text-gray-700 bg-white rounded-full hover:bg-gray-50 focus:outline-none"
          disabled={isUpdating}
        >
          <BsThreeDotsVertical className="w-4 h-4" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-20 w-40 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleStatusUpdate(0)}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex items-center w-full px-4 py-2 text-sm`}
                >
                  <FiClock className="mr-2" />
                  Set Pending
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleStatusUpdate(1)}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex items-center w-full px-4 py-2 text-sm`}
                >
                  <BsCheckCircle className="mr-2" />
                  Approve
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleStatusUpdate(2)}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex items-center w-full px-4 py-2 text-sm`}
                >
                  <BsXCircle className="mr-2" />
                  Reject
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default function MyClinicCard({
  clinic,
  clinicIndex,
  price,
}: {
  clinic: Clinic;
  clinicIndex: number;
  price: number;
}) {
  const dispatch = useAppDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { user } = useAppSelector((state) => state.userSlice);
  const adminRole = user ? Number(user) : null;

  if (adminRole !== 2 && clinic.status !== 1) {
    return null;
  }

  if (price * 20 < 420) {
    price = 500;
  }

  const handleUpdateClinic = async (values: ClinicUpdate) => {
    try {
      await dispatch(
        updateClinicById({
          values,
          ClinicId: clinic.id,
        })
      ).unwrap();
      dispatch(getClinic());
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update clinic:", error);
    }
  };

  const handleDoctorRegistration = async ({
    doctorId,
  }: {
    doctorId: number;
  }) => {
    try {
      await dispatch(
        addDoctorToClinic({
          doctorId,
          clinicId: clinic.id,
        })
      ).unwrap();
      setIsRegisterModalOpen(false);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const EditClinicForm = () => (
    <Formik
      initialValues={getInitialValues(clinic)}
      validationSchema={clinicSchema}
      onSubmit={handleUpdateClinic}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Clinic Name
            </label>
            <Field
              type="text"
              name="clinicName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
            />
            <ErrorMessage
              name="clinicName"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address Name
            </label>
            <Field
              type="text"
              name="address.name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
            />
            <ErrorMessage
              name="address.name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street
            </label>
            <Field
              type="text"
              name="address.street"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
            />
            <ErrorMessage
              name="address.street"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <Field
              type="text"
              name="address.city"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
            />
            <ErrorMessage
              name="address.city"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <Field
              type="text"
              name="address.country"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
            />
            <ErrorMessage
              name="address.country"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Clinic"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );

  const RegisterDoctorForm = () => (
    <Formik
      initialValues={{ doctorId: "" }}
      validationSchema={doctorIdSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleDoctorRegistration({ doctorId: Number(values.doctorId) });
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Doctor ID
            </label>
            <Field
              type="number"
              name="doctorId"
              placeholder="Enter doctor ID"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
            />
            <ErrorMessage
              name="doctorId"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Register Doctor"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="w-full"
    >
      {/* Edit Clinic Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Edit Clinic</h2>
          <EditClinicForm />
        </div>
      </Modal>

      {/* Register Doctor Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      >
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Register Doctor</h2>
          <RegisterDoctorForm />
        </div>
      </Modal>

      {/* Clinic Card */}
      <motion.div
        variants={fadeIn("up", "spring", 0,0)}
        whileHover={{ y: -5 }}
        className={`rounded-2xl shadow-sm bg-white hover:shadow-lg transition-all duration-300 border ${
          clinic.status === 0
            ? "border-yellow-200"
            : clinic.status === 1
            ? "border-green-200"
            : "border-red-200"
        } overflow-hidden group relative`}
      >
        {/* Clinic Image with Premium Badge and Action Buttons */}
        <div className="relative h-52 w-full">
          <Image
            src={getClinicImage(clinicIndex)}
            alt={clinic.clinicName}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {clinic.rating > 4.5 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full flex items-center text-xs font-semibold shadow-lg z-10"
            >
              <BsStarFill className="mr-1 text-yellow-300 animate-pulse" />
              Premium Clinic
            </motion.div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-80" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-3 right-3 flex space-x-2 z-10"
          >
            {adminRole === 2 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 text-blue-600 transition-all"
                onClick={() => setIsEditModalOpen(true)}
              >
                <BsPencilSquare size={18} />
              </motion.button>
            )}
            {adminRole === 2 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 text-red-600 transition-all"
                onClick={async () => {
                  await dispatch(delteClinicById(clinic.id)).unwrap();
                  dispatch(getClinic());
                }}
              >
                <BsTrash size={18} />
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Clinic Details */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="max-w-[70%]">
              <motion.h3
                whileHover={{ color: "#10b981" }}
                className="text-xl font-bold text-gray-900 line-clamp-1 transition-colors"
              >
                {clinic.clinicName}
              </motion.h3>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <BsGeoAlt className="mr-1.5 flex-shrink-0 text-gray-400" />
                <span className="line-clamp-1">
                  {clinic.address?.street || "Address not specified"}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <ClinicStatusBadge status={clinic.status} />
              <div className="mt-1">
                <StatusUpdateMenu clinicId={clinic.id} />
              </div>
            </div>
          </div>


          {/* Enhanced rating and price section */}
          <div className="flex items-center justify-between mb-4">
            {/* Rating and Price Container */}
            <div className="flex items-center space-x-2">
              {/* Rating Badge - More Vibrant */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center bg-amber-50 px-3 py-1 rounded-full border border-amber-100"
              >
                <BsStarFill className="text-amber-400 mr-1.5" />
                <span className="font-medium text-sm text-amber-800">
                  {clinic.rating.toFixed(1)}
                </span>
              </motion.div>

              {/* Price Badge - Elegant Design */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-200 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-80" />
                <span className="relative z-10 text-sm text-gray-700">
                  <span className="text-gray-500 text-xs">Price: </span>
                  {price * 20}
                </span>
              </motion.div>
            </div>

            {/* Owner Info - Cleaner Design */}
            <div className="max-w-[40%]">
              <p className="text-sm text-gray-600 truncate">
                <span className="font-semibold text-gray-700">Owner: </span>
                {clinic.ownerName || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              {user != "1" ? (
                <Link
                  href={`/clinics/${clinic.id}`}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium text-center transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                >
                  View Details
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-gradient-to-r from-green-700 to-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium text-center transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                >
                  View Details
                </button>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => setIsRegisterModalOpen(true)}
            >
              <FiPlusCircle className="text-green-600 group-hover:text-green-700 transition-colors" />
              <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                Doctor
              </span>
            </motion.button>
          </div>
        </div>

        {clinic.rating > 4.5 && (
          <div className="absolute -right-8 top-4 w-32 bg-emerald-600 text-white text-xs font-bold py-1 px-2 transform rotate-45 text-center shadow-lg z-0">
            Top Rated
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
