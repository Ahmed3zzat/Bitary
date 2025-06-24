export type ClinicRespone = {
  ClinicList: Clinic[] | null;
  myClinicList: Clinic[] | null;
  clinicIdData: Clinic | null;
  ownerInfo: OwnerInfo | null;
  msg: string | null;
  isError: boolean;
  isLoading: boolean;
  idToast: string;
};

export interface Address {
  name: string;
  street: string;
  city: string;
  country: string;
}

export interface OwnerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: number;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  gender: number;
  clinicId: number;
  userId: string;
  clinicName: string | null;
}

export interface Clinic {
  address: Address | null;
  clinicName: string;
  id: number;
  ownerId: string;
  ownerName: string | null;
  rating: number;
  status: number;
  doctors?: Doctor[];
}
export interface ClinicUpdate {
  address: Address ;
  clinicName: string;
}

export interface ClinicUpdateData {
  clinicName: string;
  address: Address;
}

export interface GetClinicByIdParams {
  values: ClinicUpdateData;
  ClinicId: number;
}
