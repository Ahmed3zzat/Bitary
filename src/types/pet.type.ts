export type petRespone = {
  PetList: Pet[] | null;
  medicalRecords: MedicalRecord[] | null;
  appointments: Appointment[] | null;
  msg: string | null;
  isError: boolean;
  isLoading: boolean;
  idToast: string;
};

export interface UpdatePetIdArgs {
  values: {
    petName: string;
    birthDate: string;
    gender: number;
    type: number;
    color?: string;
    avatar?: string | File | null|undefined;
  };
  petId?: number;
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

export interface Appointment {
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

export interface Pet {
  id: number;
  petName: string;
  birthDate: string;
  gender: number;
  type: number;
  color: string;
  avatar: string;
  userId: string;
}

