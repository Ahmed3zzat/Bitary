"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { getClinic } from "@/store/Features/clinic.slice";
import {
  createDoctor,
  getDoctorProfile,
  createDoctorSchedule,
  deleteDoctorSchedule,
  getDoctorSchedules,
  getDoctorAppointments,
  updateAppointmentStatus,
  createMedicalRecord,
  updateMedicalRecord,
  getDoctorMedicalRecords
} from "@/store/Features/doctor.slice";
import { getPetMedicalRecords } from "@/store/Features/user.pets";
import { CreateDoctorParams, CreateScheduleParams, CreateMedicalRecordParams, UpdateMedicalRecordParams } from "@/types/doctor.type";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiUser,
  FiPlus,
  FiEdit3,
  FiCheck,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiMapPin
} from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";

// Doctor registration validation schema
const DoctorRegistrationSchema = Yup.object().shape({
  specialty: Yup.string().required("Specialty is required"),
  clinicId: Yup.number().required("Clinic ID is required").positive("Clinic ID must be positive")
});

// Schedule creation validation schema
const ScheduleCreationSchema = Yup.object().shape({
  scheduleDate: Yup.date().required("Date is required"),
  startTimeString: Yup.string().required("Start time is required"),
  endTimeString: Yup.string().required("End time is required")
});

// Appointment status update validation schema
const AppointmentStatusUpdateSchema = Yup.object().shape({
  status: Yup.number().required("Status is required").oneOf([2, 3, 4], "Invalid status selected"),
  notes: Yup.string().required("Notes are required").min(3, "Notes must be at least 3 characters")
});

// Medical record validation schema
const MedicalRecordSchema = Yup.object().shape({
  diagnosis: Yup.string().required("Diagnosis is required").min(3, "Diagnosis must be at least 3 characters"),
  treatment: Yup.string().required("Treatment is required").min(3, "Treatment must be at least 3 characters"),
  notes: Yup.string().required("Notes are required").min(3, "Notes must be at least 3 characters")
});

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { ClinicList, isLoading: clinicLoading, isError: clinicError } = useAppSelector(
    (state) => state.clinicSlice
  );
  const { doctorProfile, doctorSchedules, doctorAppointments, doctorMedicalRecords, isLoading: doctorLoading } = useAppSelector(
    state => state.doctorSlice
  );
  const { medicalRecords: petMedicalRecords, isLoading: petLoading } = useAppSelector(
    state => state.petSlice
  );
  
  const [hasDoctorId, setHasDoctorId] = useState<boolean>(false);
  const [newScheduleFormVisible, setNewScheduleFormVisible] = useState<boolean>(false);
  const [doctorFormVisible, setDoctorFormVisible] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<number | null>(null);
  const [medicalRecordFormVisible, setMedicalRecordFormVisible] = useState<number | null>(null);
  const [editingMedicalRecord, setEditingMedicalRecord] = useState<{ appointmentId: number; medicalRecordId: number } | null>(null);
  const [expandedAppointments, setExpandedAppointments] = useState<Set<number>>(new Set());
  const [viewingPetRecords, setViewingPetRecords] = useState<{petId: number, petName: string} | null>(null);

  useEffect(() => {
    dispatch(getClinic());

    // Check if user has doctorId
    const doctorId = localStorage.getItem("doctorId");
    if (doctorId) {
      setHasDoctorId(true);
      try {
        // Fetch doctor profile, schedules, appointments, and medical records in one batch
        dispatch(getDoctorProfile());
        dispatch(getDoctorSchedules(parseInt(doctorId)));
        dispatch(getDoctorAppointments(parseInt(doctorId)));
        dispatch(getDoctorMedicalRecords(parseInt(doctorId)));
      } catch {
        toast.error("Failed to load doctor data");
      }
    }
  }, [dispatch]);

  // Handle doctor registration
  const handleDoctorRegistration = async (values: CreateDoctorParams) => {
    try {
      const result = await dispatch(createDoctor(values)).unwrap();
      setHasDoctorId(true);
      setDoctorFormVisible(false);

      // Fetch doctor schedules and appointments after registration
      if (result?.id) {
        dispatch(getDoctorSchedules(result.id));
        dispatch(getDoctorAppointments(result.id));
      }
    } catch {
      // Error is already handled by the slice
    }
  };

  // Handle schedule creation
  const handleCreateSchedule = async (values: Omit<CreateScheduleParams, "id" | "doctorId" | "doctorName">) => {
    const doctorId = localStorage.getItem("doctorId");
    if (!doctorId) {
      toast.error("Doctor ID not found");
      return;
    }

    const scheduleData: CreateScheduleParams = {
      id: 0, // Default for new schedule
      doctorId: parseInt(doctorId),
      doctorName: doctorProfile?.name || "Doctor",
      ...values
    };

    try {
      await dispatch(createDoctorSchedule(scheduleData)).unwrap();
      setNewScheduleFormVisible(false);
      
      // Refresh schedules
      dispatch(getDoctorSchedules(parseInt(doctorId)));
    } catch {
      // Error is already handled by the slice
    }
  };

  // Handle schedule deletion
  const handleDeleteSchedule = async (scheduleId: number) => {
    try {
      await dispatch(deleteDoctorSchedule(scheduleId)).unwrap();
      
      // Refresh schedules
      const doctorId = localStorage.getItem("doctorId");
      if (doctorId) {
        dispatch(getDoctorSchedules(parseInt(doctorId)));
      }
    } catch {
      // Error is already handled by the slice
    }
  };

  // Handle appointment status update
  const handleUpdateAppointmentStatus = async (appointmentId: number, status: number, notes: string) => {
    console.log("🎯 Dashboard: Handling appointment status update:", {
      appointmentId,
      status,
      notes,
      statusType: typeof status,
      appointmentIdType: typeof appointmentId
    });

    try {
      const result = await dispatch(updateAppointmentStatus({ appointmentId, status, notes })).unwrap();
      console.log("✅ Dashboard: Update successful:", result);
      setEditingAppointment(null);
    } catch (error) {
      console.error("❌ Dashboard: Update failed:", error);
      // Error is already handled by the slice
    }
  };

  // Handle medical record creation
  const handleCreateMedicalRecord = async (appointmentId: number, values: Omit<CreateMedicalRecordParams, 'recordDate'>) => {
    console.log("🏥 Dashboard: Creating medical record:", {
      appointmentId,
      values
    });

    try {
      const medicalRecordData = {
        ...values,
        recordDate: new Date().toISOString()
      };

      const result = await dispatch(createMedicalRecord({ appointmentId, medicalRecordData })).unwrap();
      console.log("✅ Dashboard: Medical record created successfully:", result);
      setMedicalRecordFormVisible(null);

      // Refresh medical records to show the new record
      const doctorId = localStorage.getItem("doctorId");
      if (doctorId) {
        dispatch(getDoctorMedicalRecords(parseInt(doctorId)));
      }
    } catch (error) {
      console.error("❌ Dashboard: Medical record creation failed:", error);
      // Error is already handled by the slice
    }
  };

  // Handle medical record update
  const handleUpdateMedicalRecord = async (medicalRecordId: number, values: UpdateMedicalRecordParams) => {
    console.log("🔄 Dashboard: Updating medical record:", {
      medicalRecordId,
      values
    });

    try {
      const result = await dispatch(updateMedicalRecord({ medicalRecordId, medicalRecordData: values })).unwrap();
      console.log("✅ Dashboard: Medical record updated successfully:", result);
      setEditingMedicalRecord(null);

      // Refresh medical records to show the updated record
      const doctorId = localStorage.getItem("doctorId");
      if (doctorId) {
        dispatch(getDoctorMedicalRecords(parseInt(doctorId)));
      }
    } catch (error) {
      console.error("❌ Dashboard: Medical record update failed:", error);
      // Error is already handled by the slice
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate stats efficiently
  const getWorkingDaysThisWeek = () => {
    if (!doctorSchedules?.length) return "0";

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const workingDaysThisWeek = doctorSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.scheduleDate);
      return scheduleDate >= startOfWeek && scheduleDate < endOfWeek;
    }).length;

    return workingDaysThisWeek.toString();
  };

  const getWeeklyAppointmentsCount = () => {
    if (!doctorAppointments?.length) return "0";

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return doctorAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate >= startOfWeek && appointmentDate < endOfWeek;
    }).length.toString();
  };

  const getTodayAppointmentsCount = () => {
    if (!doctorAppointments?.length) return "0";

    const today = new Date().toISOString().split('T')[0];
    return doctorAppointments.filter(appointment =>
      appointment.appointmentDate.split('T')[0] === today
    ).length.toString();
  };

  // Format appointment date and time
  const formatAppointmentDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  // Get appointment status text and color
  const getAppointmentStatus = (status: number) => {
    switch (status) {
      case 1:
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
      case 2:
        return { text: 'Approved', color: 'bg-green-100 text-green-800' };
      case 3:
        return { text: 'Rejected', color: 'bg-red-100 text-red-800' };
      case 4:
        return { text: 'Completed', color: 'bg-blue-100 text-blue-800' };
      case 5:
        return { text: 'Cancelled', color: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Get available status options for dropdown (excluding Pending and Cancelled - doctors can only approve, reject, or complete)
  const getStatusOptions = () => [
    { value: 2, label: 'Approved' },
    { value: 3, label: 'Rejected' },
    { value: 4, label: 'Completed' }
  ];

  // Check if a medical record exists for an appointment
  const getMedicalRecordForAppointment = (appointmentId: number) => {
    return doctorMedicalRecords?.find(record => record.appointmentId === appointmentId) || null;
  };

  // Toggle appointment expansion
  const toggleAppointmentExpansion = (appointmentId: number) => {
    setExpandedAppointments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appointmentId)) {
        newSet.delete(appointmentId);
      } else {
        newSet.add(appointmentId);
      }
      return newSet;
    });
  };


  // Handle viewing pet records from appointment card
  const handleViewPetRecords = (petId: number, petName: string) => {
    dispatch(getPetMedicalRecords(petId));
    setViewingPetRecords({petId, petName});
  };

  if (clinicError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-5">
            We couldn{"'"}t load your dashboard data. Please try again later.
          </p>
          <button
            onClick={() => dispatch(getClinic())}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Doctor Registration Form Modal
  const DoctorRegistrationForm = () => (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Register as a Doctor</h2>
          <button 
            onClick={() => setDoctorFormVisible(false)}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <Formik
          initialValues={{ specialty: "", clinicId: 0 }}
          validationSchema={DoctorRegistrationSchema}
          onSubmit={handleDoctorRegistration}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="specialty" className="block mb-1 font-medium text-gray-700">
                  Specialty
                </label>
                <Field
                  type="text"
                  name="specialty"
                  id="specialty"
                  className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g. Cardiology, Pediatrics, etc."
                />
                <ErrorMessage name="specialty" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              <div>
                <label htmlFor="clinicId" className="block mb-1 font-medium text-gray-700">
                  Select Clinic
                </label>
                <Field
                  as="select"
                  name="clinicId"
                  id="clinicId"
                  className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a clinic</option>
                  {ClinicList && ClinicList.length > 0 ? 
                    ClinicList.map(clinic => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.clinicName}
                      </option>
                    )) : 
                    <option disabled>No clinics available</option>
                  }
                </Field>
                <ErrorMessage name="clinicId" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setDoctorFormVisible(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || doctorLoading || !ClinicList?.length}
                  className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors disabled:bg-green-300"
                >
                  {isSubmitting || doctorLoading ? "Registering..." : "Register as Doctor"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Doctor Registration Form Modal */}
      {doctorFormVisible && <DoctorRegistrationForm />}
      
      {/* Pet Medical Records Overlay */}
      {viewingPetRecords && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingPetRecords(null)}>
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {viewingPetRecords.petName}&apos;s Medical Records
              </h2>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setViewingPetRecords(null);
                }}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {petLoading ? (
                <div className="py-4 text-center">Loading records...</div>
              ) : petMedicalRecords && petMedicalRecords.length > 0 ? (
                <div className="space-y-3">
                  {petMedicalRecords.map(record => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-green-600">
                          {new Date(record.recordDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </h3>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                        <p className="text-sm text-gray-600">{record.diagnosis}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Treatment:</p>
                        <p className="text-sm text-gray-600">{record.treatment}</p>
                      </div>
                      {record.notes && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Notes:</p>
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        Doctor: {record.doctorName}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500">
                  No medical records found for this pet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome back, {doctorProfile?.name || "Doctor"}
              </h1>
              <p className="mt-1 text-gray-600">
                Manage your schedule and appointments
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              {!hasDoctorId && (
                <button
                  onClick={() => setDoctorFormVisible(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FiUser className="mr-2" />
                  Register as Doctor
                </button>
              )}
              <Link href={"clinics/add"} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <FiPlus className="mr-2" />
                Add New Clinic
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <FiCalendar className="h-6 w-6 text-green-600" />,
                title: "Working days this week",
                value: getWorkingDaysThisWeek()
              },
              {
                icon: <CiCalendar className="h-6 w-6 text-green-600" />,
                title: "Appointments this week",
                value: getWeeklyAppointmentsCount()
              },
              {
                icon: <FiUser className="h-6 w-6 text-green-600" />,
                title: "Patients today",
                value: getTodayAppointmentsCount()
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden shadow rounded-xl transition-transform hover:scale-[1.02]"
              >
                <div className="px-5 py-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-xl p-3">
                      {stat.icon}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Appointments and Doctor Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Doctor Profile Section - If no doctor profile, show prompt */}
            {!hasDoctorId && !doctorLoading && (
              <div className="bg-white shadow overflow-hidden rounded-xl">
                <div className="px-5 py-10 text-center">
                  <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                    <FiUser className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Register as a Doctor</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Complete your doctor profile to manage schedules and appointments for your clinics.
                  </p>
                  <button
                    onClick={() => setDoctorFormVisible(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FiUser className="mr-2" />
                    Register Now
                  </button>
                </div>
              </div>
            )}
            {/* Weekly Schedule Section - Only show if user is a doctor */}
            {hasDoctorId && (
            <div className="bg-white shadow overflow-hidden rounded-xl">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Weekly Schedule
                </h2>
                <button
                  onClick={() => setNewScheduleFormVisible(!newScheduleFormVisible)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {newScheduleFormVisible ? 'Cancel' : 'Add Your Schedule'}
                </button>
              </div>
              
              {/* New Schedule Form */}
              {newScheduleFormVisible && (
                <div className="p-5 border-b border-gray-200">
                  <Formik
                    initialValues={{
                      scheduleDate: new Date().toISOString().split('T')[0],
                      startTimeString: "09:00",
                      endTimeString: "17:00"
                    }}
                    validationSchema={ScheduleCreationSchema}
                    onSubmit={handleCreateSchedule}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <div>
                          <label htmlFor="scheduleDate" className="block mb-1 text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <Field
                            type="date"
                            name="scheduleDate"
                            id="scheduleDate"
                            className="w-full p-2 border rounded"
                          />
                          <ErrorMessage name="scheduleDate" component="div" className="text-red-500 mt-1 text-xs" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="startTimeString" className="block mb-1 text-sm font-medium text-gray-700">
                              Start Time
                            </label>
                            <Field
                              type="time"
                              name="startTimeString"
                              id="startTimeString"
                              className="w-full p-2 border rounded"
                            />
                            <ErrorMessage name="startTimeString" component="div" className="text-red-500 mt-1 text-xs" />
                          </div>

                          <div>
                            <label htmlFor="endTimeString" className="block mb-1 text-sm font-medium text-gray-700">
                              End Time
                            </label>
                            <Field
                              type="time"
                              name="endTimeString"
                              id="endTimeString"
                              className="w-full p-2 border rounded"
                            />
                            <ErrorMessage name="endTimeString" component="div" className="text-red-500 mt-1 text-xs" />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting || doctorLoading}
                          className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 transition-colors disabled:bg-green-300"
                        >
                          {isSubmitting || doctorLoading ? "Creating..." : "Create Schedule"}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}

              <div className="p-5">
                {doctorLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, index) => (
                      <div key={index} className="animate-pulse flex flex-col gap-2">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : doctorSchedules && doctorSchedules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctorSchedules.map((schedule) => (
                      <div key={schedule.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-lg font-medium text-green-600">{formatDate(schedule.scheduleDate)}</p>
                            <div className="mt-2 flex items-center text-gray-600">
                              <FiCalendar className="mr-2 h-4 w-4" />
                              <p>{schedule.startTimeString} - {schedule.endTimeString}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-colors"
                            aria-label="Delete schedule"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="rounded-xl p-8 max-w-md mx-auto">
                    <CiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
                      <p className="text-gray-500 mb-4">Create your first schedule to start managing your appointments.</p>
                      <button
                        onClick={() => setNewScheduleFormVisible(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Schedule
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Patient Appointments Section - Only show if user is a doctor */}
            {hasDoctorId && (
            <div className="bg-white shadow overflow-hidden rounded-xl">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Patient Appointments
                </h2>
              </div>

              <div className="p-5">
                {doctorLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, index) => (
                      <div key={index} className="animate-pulse flex flex-col gap-2">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : doctorAppointments && doctorAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {doctorAppointments.map((appointment) => {
                      const { date, time } = formatAppointmentDateTime(appointment.appointmentDate);
                      const status = getAppointmentStatus(appointment.status);
                      const isEditing = editingAppointment === appointment.id;
                      const isExpanded = expandedAppointments.has(appointment.id);

                      return (
                        <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                          {/* Collapsed View - Always Visible */}
                          <div
                            className="p-5 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => toggleAppointmentExpansion(appointment.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                {/* Pet Name - Primary Identifier */}
                                <div className="flex items-center gap-3">
                                  <div className="bg-green-100 p-2 rounded-lg">
                                    <FiUser className="h-5 w-5 text-green-600" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{appointment.petName}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                      <div className="flex items-center gap-1">
                                        <FiClock className="h-4 w-4" />
                                        <span>{date} at {time}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <FiMapPin className="h-4 w-4" />
                                        <span>{appointment.clinicName}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Status Badge */}
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                  {status.text}
                                </span>

                                {/* Expand/Collapse Icon */}
                                <div className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                                  {isExpanded ? (
                                    <FiChevronUp className="h-5 w-5 text-gray-500" />
                                  ) : (
                                    <FiChevronDown className="h-5 w-5 text-gray-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expanded View - Conditional */}
                          {isExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50">
                              <div className="p-5 space-y-4">
                                {/* Appointment Notes */}
                                {appointment.notes && (
                                  <div className="bg-white p-4 rounded-lg border border-white">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Appointment Notes</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">{appointment.notes}</p>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap justify-end gap-3">
                                  {!isEditing ? (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Close any open medical record forms/editing
                                          setMedicalRecordFormVisible(null);
                                          setEditingMedicalRecord(null);
                                          setEditingAppointment(appointment.id);
                                        }}
                                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                          [4, 5, 3].includes(appointment.status)
                                            ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                                            : 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                        }`}
                                        title={
                                          [4, 5, 3].includes(appointment.status)
                                            ? "Cannot update completed, cancelled, or rejected appointments"
                                            : "Update appointment status"
                                        }
                                        disabled={[4, 5, 3].includes(appointment.status)}
                                      >
                                        <FiEdit3 className="mr-2 h-4 w-4" />
                                        Update Status
                                      </button>
                                      
                                      {/* View Pet Medical Records Button */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewPetRecords(appointment.petId, appointment.petName);
                                        }}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        View Medical History
                                      </button>

                                      {/* Medical Record Button - Only show for completed appointments */}
                                      {appointment.status === 4 && (() => {
                                        const existingMedicalRecord = getMedicalRecordForAppointment(appointment.id);

                                        if (existingMedicalRecord) {
                                          // Check if this medical record is currently being edited
                                          const isEditingThisRecord = editingMedicalRecord?.appointmentId === appointment.id;

                                          return (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (isEditingThisRecord) {
                                                  // If currently editing, cancel the edit
                                                  setEditingMedicalRecord(null);
                                                } else {
                                                  // Close any open appointment status editing
                                                  setEditingAppointment(null);
                                                  setEditingMedicalRecord({ appointmentId: appointment.id, medicalRecordId: existingMedicalRecord.id });
                                                }
                                              }}
                                              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                                isEditingThisRecord
                                                  ? 'text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-500'
                                                  : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-purple-500'
                                              }`}
                                              title={isEditingThisRecord ? "Cancel editing medical record" : "Edit medical record for this appointment"}
                                            >
                                              {isEditingThisRecord ? (
                                                <>
                                                  <FiX className="mr-2 h-4 w-4" />
                                                  Cancel
                                                </>
                                              ) : (
                                                <>
                                                  <FiEdit3 className="mr-2 h-4 w-4" />
                                                  Edit Medical Record
                                                </>
                                              )}
                                            </button>
                                          );
                                        } else {
                                          // Check if the add medical record form is currently open for this appointment
                                          const isAddingRecord = medicalRecordFormVisible === appointment.id;

                                          return (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (isAddingRecord) {
                                                  // If currently adding, cancel the form
                                                  setMedicalRecordFormVisible(null);
                                                } else {
                                                  // Close any open appointment status editing
                                                  setEditingAppointment(null);
                                                  setMedicalRecordFormVisible(appointment.id);
                                                }
                                              }}
                                              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                                isAddingRecord
                                                  ? 'text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-500'
                                                  : 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                              }`}
                                              title={isAddingRecord ? "Cancel adding medical record" : "Add medical record for this appointment"}
                                            >
                                              {isAddingRecord ? (
                                                <>
                                                  <FiX className="mr-2 h-4 w-4" />
                                                  Cancel
                                                </>
                                              ) : (
                                                <>
                                                  <FiPlus className="mr-2 h-4 w-4" />
                                                  Add Medical Record
                                                </>
                                              )}
                                            </button>
                                          );
                                        }
                                      })()}
                                    </>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingAppointment(null);
                                      }}
                                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                    >
                                      <FiX className="mr-2 h-4 w-4" />
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Status Update Form */}
                          {isEditing && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <Formik
                                initialValues={{
                                  status: [2, 3, 4].includes(appointment.status) ? appointment.status : 2,
                                  notes: appointment.notes || ""
                                }}
                                validationSchema={AppointmentStatusUpdateSchema}
                                onSubmit={(values) => {
                                  console.log("📝 Form submission:", {
                                    appointmentId: appointment.id,
                                    formValues: values,
                                    originalStatus: appointment.status,
                                    originalNotes: appointment.notes
                                  });
                                  // Ensure status is a number
                                  const statusNumber = typeof values.status === 'string' ? parseInt(values.status) : values.status;
                                  handleUpdateAppointmentStatus(appointment.id, statusNumber, values.notes);
                                }}
                              >
                                {({ isSubmitting }) => (
                                  <Form className="space-y-3">
                                    <div>
                                      <label htmlFor={`status-${appointment.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                      </label>
                                      <Field
                                        as="select"
                                        name="status"
                                        id={`status-${appointment.id}`}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                      >
                                        {getStatusOptions().map(option => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </Field>
                                      <ErrorMessage name="status" component="div" className="text-red-500 mt-1 text-xs" />
                                    </div>

                                    <div>
                                      <label htmlFor={`notes-${appointment.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                      </label>
                                      <Field
                                        as="textarea"
                                        name="notes"
                                        id={`notes-${appointment.id}`}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Add notes about the appointment..."
                                      />
                                      <ErrorMessage name="notes" component="div" className="text-red-500 mt-1 text-xs" />
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => setEditingAppointment(null)}
                                        className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="submit"
                                        disabled={isSubmitting || doctorLoading}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                                      >
                                        {isSubmitting || doctorLoading ? (
                                          "Updating..."
                                        ) : (
                                          <>
                                            <FiCheck className="mr-1 h-3 w-3" />
                                            Update
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </Form>
                                )}
                              </Formik>
                            </div>
                          )}

                          {/* Medical Record Form */}
                          {medicalRecordFormVisible === appointment.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Add Medical Record</h4>
                              <Formik
                                initialValues={{
                                  diagnosis: "",
                                  treatment: "",
                                  notes: ""
                                }}
                                validationSchema={MedicalRecordSchema}
                                onSubmit={(values) => {
                                  console.log("🏥 Medical Record Form submission:", {
                                    appointmentId: appointment.id,
                                    formValues: values
                                  });
                                  handleCreateMedicalRecord(appointment.id, values);
                                }}
                              >
                                {({ isSubmitting }) => (
                                  <Form className="space-y-3">
                                    <div>
                                      <label htmlFor={`diagnosis-${appointment.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                        Diagnosis
                                      </label>
                                      <Field
                                        type="text"
                                        name="diagnosis"
                                        id={`diagnosis-${appointment.id}`}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Enter diagnosis..."
                                      />
                                      <ErrorMessage name="diagnosis" component="div" className="text-red-500 mt-1 text-xs" />
                                    </div>

                                    <div>
                                      <label htmlFor={`treatment-${appointment.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                        Treatment
                                      </label>
                                      <Field
                                        type="text"
                                        name="treatment"
                                        id={`treatment-${appointment.id}`}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Enter treatment..."
                                      />
                                      <ErrorMessage name="treatment" component="div" className="text-red-500 mt-1 text-xs" />
                                    </div>

                                    <div>
                                      <label htmlFor={`medical-notes-${appointment.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                        Medical Notes
                                      </label>
                                      <Field
                                        as="textarea"
                                        name="notes"
                                        id={`medical-notes-${appointment.id}`}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Add medical notes..."
                                      />
                                      <ErrorMessage name="notes" component="div" className="text-red-500 mt-1 text-xs" />
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => setMedicalRecordFormVisible(null)}
                                        className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="submit"
                                        disabled={isSubmitting || doctorLoading}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                                      >
                                        {isSubmitting || doctorLoading ? (
                                          "Creating..."
                                        ) : (
                                          <>
                                            <FiCheck className="mr-1 h-3 w-3" />
                                            Create Medical Record
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </Form>
                                )}
                              </Formik>
                            </div>
                          )}

                          {/* Edit Medical Record Form */}
                          {editingMedicalRecord?.appointmentId === appointment.id && (() => {
                            const existingRecord = getMedicalRecordForAppointment(appointment.id);
                            if (!existingRecord) return null;

                            return (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Edit Medical Record</h4>
                                <Formik
                                  initialValues={{
                                    diagnosis: existingRecord.diagnosis,
                                    treatment: existingRecord.treatment,
                                    notes: existingRecord.notes
                                  }}
                                  validationSchema={MedicalRecordSchema}
                                  onSubmit={(values) => {
                                    console.log("🔄 Edit Medical Record Form submission:", {
                                      medicalRecordId: existingRecord.id,
                                      formValues: values
                                    });
                                    handleUpdateMedicalRecord(existingRecord.id, values);
                                  }}
                                >
                                  {({ isSubmitting }) => (
                                    <Form className="space-y-3">
                                      <div>
                                        <label htmlFor={`edit-diagnosis-${appointment.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                          Diagnosis
                                        </label>
                                        <Field
                                          type="text"
                                          name="diagnosis"
                                          id={`edit-diagnosis-${appointment.id}`}
                                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
                                          placeholder="Enter diagnosis..."
                                        />
                                        <ErrorMessage name="diagnosis" component="div" className="text-red-500 mt-1 text-xs" />
                                      </div>

                                      <div>
                                        <label htmlFor={`edit-treatment-${appointment.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                          Treatment
                                        </label>
                                        <Field
                                          type="text"
                                          name="treatment"
                                          id={`edit-treatment-${appointment.id}`}
                                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
                                          placeholder="Enter treatment..."
                                        />
                                        <ErrorMessage name="treatment" component="div" className="text-red-500 mt-1 text-xs" />
                                      </div>

                                      <div>
                                        <label htmlFor={`edit-medical-notes-${appointment.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                          Medical Notes
                                        </label>
                                        <Field
                                          as="textarea"
                                          name="notes"
                                          id={`edit-medical-notes-${appointment.id}`}
                                          rows={3}
                                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
                                          placeholder="Add medical notes..."
                                        />
                                        <ErrorMessage name="notes" component="div" className="text-red-500 mt-1 text-xs" />
                                      </div>

                                      <div className="flex justify-end space-x-2 pb-3 pe-2">
                                        <button
                                          type="button"
                                          onClick={() => setEditingMedicalRecord(null)}
                                          className="px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          disabled={isSubmitting || doctorLoading}
                                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                                        >
                                          {isSubmitting || doctorLoading ? (
                                            "Updating..."
                                          ) : (
                                            <>
                                              <FiCheck className="mr-1 h-3 w-3" />
                                              Update Medical Record
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </Form>
                                  )}
                                </Formik>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="rounded-xl p-8 max-w-md mx-auto">
                      <FiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No patient appointments</h3>
                      <p className="text-gray-500">Patient appointments will appear here when they book with you.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>

          {/* Right Column - Doctor Clinics */}
          <div className="space-y-8">
            {/* Doctor Clinics Section */}
            <div className="bg-white shadow overflow-hidden rounded-xl">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  My Clinic
                </h2>
              </div>
              <div className="p-5">
                {clinicLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(index => (
                      <div key={index} className="animate-pulse flex flex-col gap-2">
                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : doctorProfile?.clinicName ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <p className="font-medium">{doctorProfile.clinicName}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No clinics found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}