import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";
import { CreateDoctorParams, CreateScheduleParams, DoctorResponse, UpdateAppointmentStatusParams, CreateMedicalRecordParams, UpdateMedicalRecordParams } from "@/types/doctor.type";
import toast from "react-hot-toast";

// Create Doctor
export const createDoctor = createAsyncThunk(
  "Doctor/createDoctor",
  async (values: CreateDoctorParams, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Doctor`,
      method: "POST",
      data: values,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    // Save doctor ID in localStorage
    if (typeof window !== 'undefined' && data && data.id) {
      window.localStorage.setItem("doctorId", data.id.toString());
      console.log("Doctor ID saved (createDoctor):", data.id);
    }
    return data;
  }
);

// Create Doctor Schedule
export const createDoctorSchedule = createAsyncThunk(
  "Doctor/createDoctorSchedule",
  async (values: CreateScheduleParams, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Doctor/${values.doctorId}/schedules`,
      method: "POST",
      data: values,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Get Doctor Profile
export const getDoctorProfile = createAsyncThunk(
  "Doctor/getDoctorProfile",
  async (_, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Doctor/GetDoctorProfile`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.request(options);
      // Save doctor ID in localStorage
      if (typeof window !== 'undefined' && data && data.id) {
        window.localStorage.setItem("doctorId", data.id.toString());
        console.log("Doctor ID saved (getDoctorProfile):", data.id);
      }
      console.log(data)
      return data;
    } catch (error) {
      // If the user is not a doctor, this will throw an error
      console.log("User is not a doctor or error fetching doctor profile");
      throw error;
    }
  }
);

// Check if user is a doctor and save ID
export const checkAndSaveDoctorId = createAsyncThunk(
  "Doctor/checkAndSaveDoctorId",
  async (_, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    
    if (!token) return null;
    
    const options = {
      url: `http://bitary.runasp.net/api/Doctor/GetDoctorProfile`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    
    try {
      const { data } = await axios.request(options);
      if (data && data.id) {
        // Ensure doctorId is saved to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem("doctorId", data.id.toString());
          console.log("Doctor ID saved:", data.id);
        }
      }
      return data;
    } catch {
      // Silently fail - user might not be a doctor
      console.log("User is not a doctor or error fetching doctor profile");
      return null;
    }
  }
);

// Delete Doctor Schedule
export const deleteDoctorSchedule = createAsyncThunk(
  "Doctor/deleteDoctorSchedule",
  async (scheduleId: number, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Doctor/schedules/${scheduleId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Delete Doctor Profile
export const deleteDoctor = createAsyncThunk(
  "Doctor/deleteDoctor",
  async (_, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const doctorId = typeof window !== 'undefined' ? window.localStorage.getItem("doctorId") : null;
    
    if (!doctorId) {
      throw new Error("Doctor ID not found");
    }
    
    const options = {
      url: `http://bitary.runasp.net/api/Doctor/${doctorId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    
    const { data } = await axios.request(options);
    
    // Remove doctor ID from localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem("doctorId");
    }
    
    return data;
  }
);

// Get Doctor Schedules
export const getDoctorSchedules = createAsyncThunk(
  "Doctor/getDoctorSchedules",
  async (doctorId: number, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Doctor/${doctorId}/schedules`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.request(options);
      return data;
    } catch (error) {
      console.log("Error fetching doctor schedules");
      throw error;
    }
  }
);

// Get Doctor Appointments
export const getDoctorAppointments = createAsyncThunk(
  "Doctor/getDoctorAppointments",
  async (doctorId: number, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Appointment/doctor/${doctorId}?fromDate=1999-01-01T00:00:00.0000000&toDate=2099-12-31T23:59:59.9999999`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.request(options);
      return data;
    } catch (error) {
      console.log("Error fetching doctor appointments");
      throw error;
    }
  }
);

// Update Appointment Status
export const updateAppointmentStatus = createAsyncThunk(
  "Doctor/updateAppointmentStatus",
  async (params: UpdateAppointmentStatusParams, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const { appointmentId, status, notes } = params;

    console.log("🔄 Updating appointment status:", {
      appointmentId,
      status,
      notes,
      statusType: typeof status,
      statusValue: status,
      token: token ? "Token present" : "No token"
    });

    // Log specific status mapping
    const statusMapping = {
      1: "Pending",
      2: "Approved",
      3: "Rejected",
      4: "Completed",
      5: "Cancelled"
    };
    console.log(`📊 Status mapping: ${status} = ${statusMapping[status as keyof typeof statusMapping] || 'Unknown'}`);

    const options = {
      url: `http://bitary.runasp.net/api/Appointment/${appointmentId}/status`,
      method: "PUT",
      data: {
        status,
        notes
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    };

    console.log("📤 API Request:", {
      url: options.url,
      method: options.method,
      data: options.data,
      headers: options.headers
    });

    try {
      const response = await axios.request(options);
      console.log("✅ API Response Success:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      return { ...response.data, appointmentId }; // Return appointmentId for state update
    } catch (error: unknown) {
      const axiosError = error as { message?: string; response?: { status?: number; statusText?: string; data?: unknown; headers?: unknown }; config?: unknown };
      console.error("❌ API Response Error:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
        config: axiosError.config,
        requestedStatus: status,
        requestedStatusName: statusMapping[status as keyof typeof statusMapping] || 'Unknown'
      });



      // Log the full error object for debugging
      console.error("Full error object:", error);

      throw error;
    }
  }
);

// Create Medical Record
export const createMedicalRecord = createAsyncThunk(
  "Doctor/createMedicalRecord",
  async ({ appointmentId, medicalRecordData }: { appointmentId: number; medicalRecordData: CreateMedicalRecordParams }, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;

    console.log("🏥 Creating medical record:", {
      appointmentId,
      medicalRecordData,
      token: token ? "Token present" : "No token"
    });

    const options = {
      url: `http://bitary.runasp.net/api/MedicalRecord/${appointmentId}`,
      method: "POST",
      data: medicalRecordData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    };

    console.log("📤 Medical Record API Request:", {
      url: options.url,
      method: options.method,
      data: options.data,
      headers: options.headers
    });

    try {
      const response = await axios.request(options);
      console.log("✅ Medical Record API Response Success:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      return { ...response.data, appointmentId }; // Return appointmentId for state update
    } catch (error: unknown) {
      const axiosError = error as { message?: string; response?: { status?: number; statusText?: string; data?: unknown; headers?: unknown }; config?: unknown };
      console.error("❌ Medical Record API Response Error:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
        config: axiosError.config
      });

      console.error("Full error object:", error);
      throw error;
    }
  }
);

// Update Medical Record
export const updateMedicalRecord = createAsyncThunk(
  "Doctor/updateMedicalRecord",
  async ({ medicalRecordId, medicalRecordData }: { medicalRecordId: number; medicalRecordData: UpdateMedicalRecordParams }, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;

    console.log("🔄 Updating medical record:", {
      medicalRecordId,
      medicalRecordData,
      token: token ? "Token present" : "No token"
    });

    const options = {
      url: `http://bitary.runasp.net/api/MedicalRecord/${medicalRecordId}`,
      method: "PUT",
      data: medicalRecordData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    };

    console.log("📤 Update Medical Record API Request:", {
      url: options.url,
      method: options.method,
      data: options.data,
      headers: options.headers
    });

    try {
      const response = await axios.request(options);
      console.log("✅ Update Medical Record API Response Success:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      return { ...response.data, medicalRecordId }; // Return medicalRecordId for state update
    } catch (error: unknown) {
      const axiosError = error as { message?: string; response?: { status?: number; statusText?: string; data?: unknown; headers?: unknown }; config?: unknown };
      console.error("❌ Update Medical Record API Response Error:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
        config: axiosError.config
      });

      console.error("Full error object:", error);
      throw error;
    }
  }
);

// Get Doctor Medical Records
export const getDoctorMedicalRecords = createAsyncThunk(
  "Doctor/getDoctorMedicalRecords",
  async (doctorId: number, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;

    console.log("🏥 Fetching doctor medical records:", {
      doctorId,
      token: token ? "Token present" : "No token"
    });

    const options = {
      url: `http://bitary.runasp.net/api/MedicalRecord/doctor/${doctorId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("📤 Get Medical Records API Request:", {
      url: options.url,
      method: options.method,
      headers: options.headers
    });

    try {
      const response = await axios.request(options);
      console.log("✅ Get Medical Records API Response Success:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { message?: string; response?: { status?: number; statusText?: string; data?: unknown; headers?: unknown }; config?: unknown };
      console.error("❌ Get Medical Records API Response Error:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
        config: axiosError.config
      });

      console.error("Full error object:", error);
      throw error;
    }
  }
);

const initialState: DoctorResponse = {
  doctorProfile: null,
  doctorSchedules: null,
  doctorAppointments: null,
  doctorMedicalRecords: null,
  isError: false,
  isLoading: false,
  idToast: ``,
  msg: ``,
};

const doctorSlice = createSlice({
  name: "Doctor",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Create Doctor
    builder.addCase(createDoctor.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.doctorProfile = action.payload;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ Doctor profile created successfully");
    });
    builder.addCase(createDoctor.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      toast.error("❌ Failed to create doctor profile. Please try again.");
      prevState.msg = "failed";
    });
    builder.addCase(createDoctor.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Creating doctor profile...");
    });

    // Create Doctor Schedule
    builder.addCase(createDoctorSchedule.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ Doctor schedule created successfully");
    });
    builder.addCase(createDoctorSchedule.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      toast.error("❌ Failed to create doctor schedule. Please try again.");
      prevState.msg = "failed";
    });
    builder.addCase(createDoctorSchedule.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Creating doctor schedule...");
    });

    // Get Doctor Profile
    builder.addCase(getDoctorProfile.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.doctorProfile = action.payload;
      prevState.msg = "success";
    });
    builder.addCase(getDoctorProfile.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      prevState.msg = "failed";
    });
    builder.addCase(getDoctorProfile.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
    });
    
    // Check if user is a doctor
    builder.addCase(checkAndSaveDoctorId.fulfilled, (prevState, action) => {
      if (action.payload) {
        prevState.doctorProfile = action.payload;
      }
    });

    // Delete Doctor Schedule
    builder.addCase(deleteDoctorSchedule.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ Doctor schedule deleted successfully");
    });
    builder.addCase(deleteDoctorSchedule.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      toast.error("❌ Failed to delete doctor schedule. Please try again.");
      prevState.msg = "failed";
    });
    builder.addCase(deleteDoctorSchedule.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Deleting schedule...");
    });

    // Delete Doctor Profile
    builder.addCase(deleteDoctor.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.doctorProfile = null;
      prevState.doctorSchedules = null;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ Doctor profile deleted successfully");
    });
    builder.addCase(deleteDoctor.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      toast.error("❌ Failed to delete doctor profile. Please try again.");
      prevState.msg = "failed";
    });
    builder.addCase(deleteDoctor.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Deleting doctor profile...");
    });

    // Get Doctor Schedules
    builder.addCase(getDoctorSchedules.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.doctorSchedules = action.payload;
      prevState.msg = "success";
    });
    builder.addCase(getDoctorSchedules.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      prevState.msg = "failed";
    });
    builder.addCase(getDoctorSchedules.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
    });

    // Get Doctor Appointments
    builder.addCase(getDoctorAppointments.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.doctorAppointments = action.payload;
      prevState.msg = "success";
    });
    builder.addCase(getDoctorAppointments.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      prevState.msg = "failed";
    });
    builder.addCase(getDoctorAppointments.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
    });

    // Update Appointment Status
    builder.addCase(updateAppointmentStatus.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ Appointment status updated successfully");

      // Update the specific appointment in the state
      if (prevState.doctorAppointments && action.payload.appointmentId) {
        const appointmentIndex = prevState.doctorAppointments.findIndex(
          appointment => appointment.id === action.payload.appointmentId
        );
        if (appointmentIndex !== -1) {
          // Update the appointment with new status and notes
          prevState.doctorAppointments[appointmentIndex] = {
            ...prevState.doctorAppointments[appointmentIndex],
            status: action.meta.arg.status,
            notes: action.meta.arg.notes
          };
        }
      }
    });
    builder.addCase(updateAppointmentStatus.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      toast.error("❌ Failed to update appointment status. Please try again.");
      prevState.msg = "failed";
    });
    builder.addCase(updateAppointmentStatus.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Updating appointment status...");
    });

    // Create Medical Record
    builder.addCase(createMedicalRecord.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ Medical record created successfully");
    });
    builder.addCase(createMedicalRecord.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      toast.error("❌ Failed to create medical record. Please try again.");
      prevState.msg = "failed";
    });
    builder.addCase(createMedicalRecord.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Creating medical record...");
    });

    // Update Medical Record
    builder.addCase(updateMedicalRecord.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ Medical record updated successfully");
    });
    builder.addCase(updateMedicalRecord.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      toast.error("❌ Failed to update medical record. Please try again.");
      prevState.msg = "failed";
    });
    builder.addCase(updateMedicalRecord.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Updating medical record...");
    });

    // Get Doctor Medical Records
    builder.addCase(getDoctorMedicalRecords.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.doctorMedicalRecords = action.payload;
      prevState.msg = "success";
    });
    builder.addCase(getDoctorMedicalRecords.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      prevState.doctorMedicalRecords = null;
      prevState.msg = "failed";
    });
    builder.addCase(getDoctorMedicalRecords.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
    });
  },
});

export default doctorSlice.reducer; 