"use client";

import Link from "next/link";
import React, { useState } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { FaCalendarAlt, FaUserMd } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import {  IoIosArrowForward, IoMdMedical } from "react-icons/io";
import { MdEventAvailable, MdMedicalServices, MdVaccines } from "react-icons/md";

export default function Wellness() {
  const [vaccinesExpanded, setVaccinesExpanded] = useState(true);
  const [allergiesExpanded, setAllergiesExpanded] = useState(false);
  const [appointmentsExpanded, setAppointmentsExpanded] = useState(false);
  const [treatmentsExpanded, setTreatmentsExpanded] = useState(false);

  return (
    <div className="mt-6 space-y-4">
            <div className="flex items-center mb-8 ps-4">
              <h1 className="text-2xl font-bold text-gray-800">Wellness</h1>
              <Link
                href="/health/medicalRecords"
                className="p-2 rounded-full hover:bg-gray-200 mr-4"
              >
                <IoIosArrowForward className="text-gray-600 ms-3 text-xl" />
              </Link>
            </div>
      {/* Vaccines */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between p-5">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-green-100 p-3 rounded-full">
              <MdVaccines className="text-green-600 text-xl" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Vaccines</h3>
                  <p className="text-sm text-gray-500">View vaccination history</p>
                </div>
                <div className="flex items-center gap-2">
                  {!vaccinesExpanded ? (
                    <AiFillPlusCircle
                      onClick={() => setVaccinesExpanded(!vaccinesExpanded)}
                      className="text-green-500 text-xl cursor-pointer hover:text-green-600"
                    />
                  ) : (
                    <AiFillMinusCircle
                      onClick={() => setVaccinesExpanded(!vaccinesExpanded)}
                      className="text-green-500 text-xl cursor-pointer hover:text-green-600"
                    />
                  )}
                  <FiChevronRight className="text-gray-400" />
                </div>
              </div>

              {vaccinesExpanded && (
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">2023</h3>
                    <div className="space-y-4 pl-6 border-l-2 border-green-200">
                      <div className="bg-green-50 p-4 rounded-lg hover:shadow-xs transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Nobivac KV</h4>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                            <FaCalendarAlt className="text-xs" />
                            11.03.2023
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaUserMd className="text-gray-400" />
                          <span>dr. Martha Roth</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-4">2022</h3>
                    <div className="space-y-4 pl-6 border-l-2 border-green-200">
                      <div className="bg-green-50 p-4 rounded-lg hover:shadow-xs transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Rabisin</h4>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                            <FaCalendarAlt className="text-xs" />
                            20.08.2022
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaUserMd className="text-gray-400" />
                          <span>dr. Martha Roth</span>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg hover:shadow-xs transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Nobivac Parvo-C</h4>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                            <FaCalendarAlt className="text-xs" />
                            20.08.2022
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaUserMd className="text-gray-400" />
                          <span>dr. Martha Roth</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between p-5">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-pink-100 p-3 rounded-full">
              <IoMdMedical className="text-pink-600 text-xl" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Allergies</h3>
                  <p className="text-sm text-gray-500">Record allergic reactions</p>
                </div>
                <div className="flex items-center gap-2">
                  {!allergiesExpanded ? (
                    <AiFillPlusCircle
                      onClick={() => setAllergiesExpanded(!allergiesExpanded)}
                      className="text-green-500 text-xl cursor-pointer hover:text-green-600"
                    />
                  ) : (
                    <AiFillMinusCircle
                      onClick={() => setAllergiesExpanded(!allergiesExpanded)}
                      className="text-green-500 text-xl cursor-pointer hover:text-green-600"
                    />
                  )}
                  <FiChevronRight className="text-gray-400" />
                </div>
              </div>

              {allergiesExpanded && (
                <div className="mt-4 space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg hover:shadow-xs transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Pollen Allergy</h4>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                        <FaCalendarAlt className="text-xs" />
                        15.05.2023
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUserMd className="text-gray-400" />
                      <span>dr. Martha Roth</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between p-5">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-yellow-100 p-3 rounded-full">
              <MdEventAvailable className="text-yellow-600 text-xl" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Appointments</h3>
                  <p className="text-sm text-gray-500">Schedule vet visits</p>
                </div>
                <div className="flex items-center gap-2">
                  {!appointmentsExpanded ? (
                    <AiFillPlusCircle
                      onClick={() => setAppointmentsExpanded(!appointmentsExpanded)}
                      className="text-green-500 text-xl cursor-pointer hover:text-green-600"
                    />
                  ) : (
                    <AiFillMinusCircle
                      onClick={() => setAppointmentsExpanded(!appointmentsExpanded)}
                      className="text-green-500 text-xl cursor-pointer hover:text-green-600"
                    />
                  )}
                  <FiChevronRight className="text-gray-400" />
                </div>
              </div>

              {appointmentsExpanded && (
                <div className="mt-4 space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg hover:shadow-xs transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Annual Checkup</h4>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                        <FaCalendarAlt className="text-xs" />
                        10.06.2023
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUserMd className="text-gray-400" />
                      <span>dr. Martha Roth</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Other Treatments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between p-5">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-red-100 p-3 rounded-full">
              <MdMedicalServices className="text-red-600 text-xl" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Other Treatments</h3>
                  <p className="text-sm text-gray-500">
                    Medical procedures & medications
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!treatmentsExpanded ? (
                    <AiFillPlusCircle
                      onClick={() => setTreatmentsExpanded(!treatmentsExpanded)}
                      className="text-green-500 text-xl cursor-pointer hover:text-green-600"
                    />
                  ) : (
                    <AiFillMinusCircle
                      onClick={() => setTreatmentsExpanded(!treatmentsExpanded)}
                      className="text-green-500 text-xl cursor-pointer hover:text-green-600"
                    />
                  )}
                  <FiChevronRight className="text-gray-400" />
                </div>
              </div>

              {treatmentsExpanded && (
                <div className="mt-4 space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg hover:shadow-xs transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Dental Cleaning</h4>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                        <FaCalendarAlt className="text-xs" />
                        22.04.2023
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUserMd className="text-gray-400" />
                      <span>dr. Martha Roth</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}