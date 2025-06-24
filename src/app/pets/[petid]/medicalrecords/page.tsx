"use client";
import { FaCalendarAlt, FaUserMd, FaNotesMedical, FaChevronDown, FaChevronUp, FaStethoscope } from "react-icons/fa";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getPetMedicalRecords, getUserPets } from "@/store/Features/user.pets";
import { RootState } from "@/store/store";
import { AnyAction } from "@reduxjs/toolkit";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { FiFileText } from "react-icons/fi";

export default function MedicalRecords() {
  const params = useParams();
  const dispatch = useDispatch();
  const { PetList, medicalRecords, isLoading } = useSelector((state: RootState) => state.petSlice);

  const petId = Number(params.petid);
  const [loading, setLoading] = useState(true);

  // State to track which medical record cards are expanded
  const [expandedRecords, setExpandedRecords] = useState<Set<number>>(new Set());

  // Find pet in PetList
  const pet = useMemo(() => {
    return PetList?.find(p => p.id === petId) || null;
  }, [PetList, petId]);

  // Function to toggle record expansion
  const toggleRecordExpansion = useCallback((recordId: number) => {
    setExpandedRecords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(getUserPets() as unknown as AnyAction);
        await dispatch(getPetMedicalRecords(petId) as unknown as AnyAction);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dispatch, petId]);

  // Initialize expanded state - start with all records collapsed
  useEffect(() => {
    if (medicalRecords?.length) {
      // Start with all records collapsed (empty Set)
      setExpandedRecords(new Set());
    }
  }, [medicalRecords]);

  // Format helpers
  const formatShortDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  }, []);

  // Sort medical records by date - most recent first
  const sortedMedicalRecords = useMemo(() => {
    if (!medicalRecords?.length) return [];
    
    return [...medicalRecords].sort((a, b) => 
      new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
    );
  }, [medicalRecords]);

  if (loading || isLoading) {
    return (
      <>
        {/* Header */}
        <div className="flex items-center mb-8 ps-4">
          <Link
            href={`/pets/${petId}/appointments`}
            className="p-2 rounded-full hover:bg-gray-200 mr-4"
          >
            <IoIosArrowBack className="text-gray-600 text-xl" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
        </div>

        {/* Loading State */}
        <div className="space-y-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 animate-pulse">
                {/* Header skeleton - matches collapsed state */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-gray-200 p-2 rounded-lg w-10 h-10"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (!pet) {
    return <div className="flex justify-center items-center min-h-screen flex-col">
      <div className="text-xl text-gray-600 mb-4">Pet not found</div>
      <div className="text-sm text-gray-500">The pet with ID {petId} could not be found.</div>
    </div>;
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center mb-8 ps-4">
        <Link
          href={`/pets/${petId}/appointments`}
          className="p-2 rounded-full hover:bg-gray-200 mr-4"
        >
          <IoIosArrowBack className="text-gray-600 text-xl" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
      </div>

      {/* Medical Records */}
      {sortedMedicalRecords.length > 0 ? (
        <div className="space-y-4">
          {sortedMedicalRecords.map((record) => {
            const isExpanded = expandedRecords.has(record.id);

            return (
              <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Clickable Header - Always Visible */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleRecordExpansion(record.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="bg-green-50 p-2 rounded-lg">
                        <FaNotesMedical className="text-green-600 text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{record.diagnosis}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {record.treatment.length > 100
                            ? `${record.treatment.substring(0, 100)}...`
                            : record.treatment
                          }
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FaUserMd className="text-xs" />
                            <span>Dr. {record.doctorName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-xs" />
                            <span>{formatShortDate(record.recordDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
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
                      {/* Treatment Information */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full mt-1">
                            <FaStethoscope className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">Treatment</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{record.treatment}</p>
                          </div>
                        </div>
                      </div>

                      {/* Notes Section */}
                      {record.notes && (
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-400">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-100 p-2 rounded-full mt-1">
                              <FiFileText className="text-green-600 text-sm" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">Additional Notes</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{record.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FaNotesMedical className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medical Records Yet</h3>
          <p className="text-gray-500 mb-6">Your pet doesn&apos;t have any medical records on file.</p>
          <Link
            href="/clinics/view"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
          >
            <FaNotesMedical className="text-sm" />
            Book a Checkup
          </Link>
        </div>
      )}
    </>
  );
}