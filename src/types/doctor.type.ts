export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  gender: number;
  clinicId: number;
  userId: string;
  clinicName: string;
  schedules?: Schedule[];
}

export interface Schedule {
  id: number;
  doctorId: number;
  scheduleDate: string;
  startTimeString: string;
  endTimeString: string;
  doctorName: string;
}

export interface CreateDoctorParams {
  specialty: string;
  clinicId: number;
}

export interface CreateScheduleParams {
  id: number;
  doctorId: number;
  scheduleDate: string;
  startTimeString: string;
  endTimeString: string;
  doctorName: string;
}

export interface DoctorAppointment {
  id: number;
  userId: string;
  petId: number;
  petName: string;
  clinicId: number;
  clinicName: string;
  doctorId: number;
  doctorName: string;
  appointmentDate: string;
  status: number;
  notes: string;
  createdAt: string;
}

export interface UpdateAppointmentStatusParams {
  appointmentId: number;
  status: number;
  notes: string;
}

export interface CreateMedicalRecordParams {
  diagnosis: string;
  treatment: string;
  recordDate: string;
  notes: string;
}

export interface UpdateMedicalRecordParams {
  diagnosis: string;
  treatment: string;
  notes: string;
}

export interface MedicalRecord {
  id: number;
  diagnosis: string;
  treatment: string;
  recordDate: string;
  notes: string;
  petId: number;
  petName: string;
  doctorId: number;
  doctorName: string;
  appointmentId: number;
}

export interface DoctorResponse {
  doctorProfile: Doctor | null;
  doctorSchedules: Schedule[] | null;
  doctorAppointments: DoctorAppointment[] | null;
  doctorMedicalRecords: MedicalRecord[] | null;
  isError: boolean;
  isLoading: boolean;
  idToast: string;
  msg: string;
}