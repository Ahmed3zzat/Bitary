"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaUserMd, FaHospital, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaSpinner, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FiMapPin, FiCalendar, FiUser, FiClock as FiClockOutline } from "react-icons/fi";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { getPetAppointments } from "@/store/Features/user.pets";

export default function Appointments() {
  const params = useParams();
  const petid = params.petid as string;
  const dispatch = useAppDispatch();
  const { appointments, isLoading, isError } = useAppSelector((state) => state.petSlice);

  // State to track which appointment cards are expanded
  const [expandedAppointments, setExpandedAppointments] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (petid) {
      dispatch(getPetAppointments(Number(petid)));
    }
  }, [dispatch, petid]);

  // Function to toggle appointment expansion
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

  // Function to format date and time
  const formatAppointmentDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return { date: formattedDate, time: formattedTime };
  };

  // Function to get appointment status with styling
  const getAppointmentStatus = (status: number) => {
    switch (status) {
      case 1:
        return {
          text: 'Pending',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <FaSpinner className="text-yellow-600" />
        };
      case 2:
        return {
          text: 'Approved',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <FaCheckCircle className="text-green-600" />
        };
      case 3:
        return {
          text: 'Rejected',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <FaTimesCircle className="text-red-600" />
        };
      case 4:
        return {
          text: 'Completed',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <FaCheckCircle className="text-blue-600" />
        };
      case 5:
        return {
          text: 'Cancelled',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <FaTimesCircle className="text-gray-600" />
        };
      default:
        return {
          text: 'Unknown',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <FaExclamationCircle className="text-gray-600" />
        };
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center mb-8 ps-4">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <Link
          href={`/pets/${petid}/medicalrecords`}
          className="p-2 rounded-full hover:bg-gray-200 mr-4"
        >
          <IoIosArrowForward className="text-gray-600 text-xl" />
        </Link>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 animate-pulse">
                  {/* Header skeleton - matches collapsed state */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-gray-200 p-2 rounded-lg w-10 h-10"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10 bg-red-50 rounded-xl border border-red-200">
            <p className="text-red-600">Error loading appointments</p>
            <button
              onClick={() => dispatch(getPetAppointments(Number(petid)))}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : appointments && appointments.length > 0 ? (
          appointments.map((appointment) => {
            const { date, time } = formatAppointmentDateTime(appointment.appointmentDate);
            const status = getAppointmentStatus(appointment.status);
            const isExpanded = expandedAppointments.has(appointment.id);

            return (
              <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Clickable Header - Always Visible */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleAppointmentExpansion(appointment.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-green-50 p-2 rounded-lg">
                        <FaHospital className="text-green-600 text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{appointment.clinicName}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FiMapPin className="text-xs" />
                          Veterinary Clinic
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${status.color}`}>
                        {status.icon}
                        {status.text}
                      </div>
                      <div className="text-gray-400">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Details Section */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4">
                      {/* Appointment Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Doctor Information */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-100 p-2 rounded-full">
                              <FaUserMd className="text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Attending Doctor</p>
                              <p className="font-bold text-gray-900">Dr. {appointment.doctorName}</p>
                            </div>
                          </div>
                        </div>

                        {/* Date & Time Information */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-100 p-2 rounded-full">
                              <FiCalendar className="text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Appointment Date</p>
                              <p className="font-bold text-gray-900">{date}</p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <FiClockOutline className="text-xs" />
                                {time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes Section */}
                      {appointment.notes && (
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-400">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-100 p-2 rounded-full mt-1">
                              <FiUser className="text-green-600 text-sm" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">Appointment Notes</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{appointment.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaHospital className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Yet</h3>
            <p className="text-gray-500 mb-6">Your pet doesn&apos;t have any scheduled appointments.</p>
            <Link
              href="/clinics/view"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
              <FaHospital className="text-sm" />
              Book an Appointment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}