import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";
import toast from "react-hot-toast";

export interface CreateAppointmentParams {
  petId: number;
  clinicId: number;
  doctorId: number;
  appointmentDate: string;
  notes: string;
}

export interface ClinicAppointment {
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

export interface DoctorSchedule {
  id: number;
  doctorId: number;
  scheduleDate: string;
  startTimeString: string;
  endTimeString: string;
  doctorName: string;
}

export interface AppointmentResponse {
  isLoading: boolean;
  isError: boolean;
  msg: string;
  idToast: string;
  clinicAppointments: ClinicAppointment[] | null;
  clinicAppointmentsLoading: boolean;
  clinicAppointmentsError: boolean;
  doctorSchedules: DoctorSchedule[] | null;
  doctorSchedulesLoading: boolean;
  doctorSchedulesError: boolean;
}

// Create Appointment
export const createAppointment = createAsyncThunk(
  "Appointment/createAppointment",
  async (values: CreateAppointmentParams, state) => {
    try {
      const store = state.getState() as RootState;
      const token = store.userSlice.token;

      const options = {
        url: `http://bitary.runasp.net/api/Appointment`,
        method: "POST",
        data: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Get Clinic Appointments
export const getClinicAppointments = createAsyncThunk(
  "Appointment/getClinicAppointments",
  async (clinicId: number, state) => {
    try {
      const store = state.getState() as RootState;
      const token = store.userSlice.token;

      const options = {
        url: `http://bitary.runasp.net/api/Appointment/clinic/${clinicId}?fromDate=1999-01-01T00:00:00.0000000&toDate=2099-12-31T23:59:59.9999999`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log("Error fetching clinic appointments");
      throw error;
    }
  }
);

// Get Doctor Schedules
export const getDoctorSchedules = createAsyncThunk(
  "Appointment/getDoctorSchedules",
  async (doctorId: number, state) => {
    try {
      const store = state.getState() as RootState;
      const token = store.userSlice.token;

      const options = {
        url: `http://bitary.runasp.net/api/Doctor/${doctorId}/schedules`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log("Error fetching doctor schedules");
      throw error;
    }
  }
);

const initialState: AppointmentResponse = {
  isLoading: false,
  isError: false,
  msg: "",
  idToast: "",
  clinicAppointments: null,
  clinicAppointmentsLoading: false,
  clinicAppointmentsError: false,
  doctorSchedules: null,
  doctorSchedulesLoading: false,
  doctorSchedulesError: false,
};

const appointmentSlice = createSlice({
  name: "Appointment",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Create Appointment
    builder.addCase(createAppointment.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("Appointment booked successfully!");
    });
    builder.addCase(createAppointment.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      toast.error("Failed to book appointment. Please try again.");
      prevState.msg = "failed";
    });
    builder.addCase(createAppointment.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("Booking your appointment...");
    });

    // Get Clinic Appointments
    builder.addCase(getClinicAppointments.fulfilled, (prevState, action) => {
      prevState.clinicAppointmentsLoading = false;
      prevState.clinicAppointmentsError = false;
      prevState.clinicAppointments = action.payload;
    });
    builder.addCase(getClinicAppointments.rejected, (prevState) => {
      prevState.clinicAppointmentsLoading = false;
      prevState.clinicAppointmentsError = true;
      prevState.clinicAppointments = null;
    });
    builder.addCase(getClinicAppointments.pending, (prevState) => {
      prevState.clinicAppointmentsLoading = true;
      prevState.clinicAppointmentsError = false;
    });

    // Get Doctor Schedules
    builder.addCase(getDoctorSchedules.fulfilled, (prevState, action) => {
      prevState.doctorSchedulesLoading = false;
      prevState.doctorSchedulesError = false;
      prevState.doctorSchedules = action.payload;
    });
    builder.addCase(getDoctorSchedules.rejected, (prevState) => {
      prevState.doctorSchedulesLoading = false;
      prevState.doctorSchedulesError = true;
      prevState.doctorSchedules = null;
    });
    builder.addCase(getDoctorSchedules.pending, (prevState) => {
      prevState.doctorSchedulesLoading = true;
      prevState.doctorSchedulesError = false;
    });
  },
});

export default appointmentSlice.reducer;
