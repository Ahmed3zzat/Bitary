import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";
import { ClinicRespone, GetClinicByIdParams } from "@/types/clinic.type";
import toast from "react-hot-toast";

// Create Clinic
export const createClinic = createAsyncThunk(
  "Clinic/createClinic",
  async (
    values: {
      clinicName: string;
      address: {
        name: string;
        street: string;
        city: string;
        country: string;
      };
    },
    state
  ) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Clinic`,
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

// Get Clinic
export const getClinic = createAsyncThunk(
  "Clinic/getClinic",
  async (_, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Clinic`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Get MyClinic
export const getMyClinic = createAsyncThunk(
  "Clinic/getMyClinic",
  async (_, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Clinic/my`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    
    try {
      const { data } = await axios.request(options);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        // Silently handle the 403 error - user doesn't have permission (not a doctor)
        console.log("User doesn't have permission to access my clinics (likely not a doctor)");
        return [];
      }
      throw error;
    }
  }
);

// Get Clinic By Id
export const getClinicById = createAsyncThunk(
  "Clinic/getClinicById",
  async (ClinicId: number, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Clinic/${ClinicId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Get User Information by User ID (for clinic owner)
export const getUserById = createAsyncThunk(
  "Clinic/getUserById",
  async (userId: string, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Authentication/GetUserInformation/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.request(options);
      return data;
    } catch (error) {
      console.log("Error fetching user information:", error);
      throw error;
    }
  }
);

// Add Doctor To Clinic
export const addDoctorToClinic = createAsyncThunk(
  "Clinic/addDoctorToClinic",
  async (dataId: { clinicId: number; doctorId: number }, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Clinic/${dataId.clinicId}/doctors/${dataId.doctorId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Update Clinic By Id
export const updateClinicById = createAsyncThunk(
  "Clinic/updateClinicById",
  async ({ values, ClinicId }: GetClinicByIdParams, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Clinic/${ClinicId}`,
      method: "PUT",
      data: values,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Update Clinic By Admin Status
export const updateClinicByAdmin = createAsyncThunk(
  "Clinic/updateClinicByAdmin",
  async ({ status, ClinicId }: { status: number; ClinicId: number }, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Clinic/${ClinicId}/admin/status`,
      method: "PUT",
      data: { status },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    /*
    Pending = 0,
    Approved = 1,
    Rejected = 2
    */
    const { data } = await axios.request(options);
    return data;
  }
);

// Delete Clinic By Id
export const delteClinicById = createAsyncThunk(
  "Clinic/delteClinicById",
  async (ClinicId: number, state) => {
    const store = state["getState"]() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Clinic/${ClinicId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

const initialState: ClinicRespone = {
  ClinicList: null,
  myClinicList: null,
  clinicIdData: null,
  ownerInfo: null,
  isError: false,
  isLoading: false,
  idToast: ``,
  msg: ``,
};

const x = createSlice({
  name: "Clinic",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Create Clinic
    builder.addCase(createClinic.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ The Clinic Was Created");
    });
    builder.addCase(createClinic.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      toast.error("❌ The Request To Add A Clinic Failed. Please Try Again.");
      prevState.msg = "faild";
    });
    builder.addCase(createClinic.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Get Clinic
    builder.addCase(getClinic.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      prevState.ClinicList = action.payload;
    });
    builder.addCase(getClinic.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      prevState.msg = "faild";
    });
    builder.addCase(getClinic.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
    });

    // Get My Clinic
    builder.addCase(getMyClinic.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      prevState.myClinicList = action.payload;
    });
    builder.addCase(getMyClinic.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      prevState.msg = "faild";
    });
    builder.addCase(getMyClinic.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
    });

    // Get My Clinic By Id
    builder.addCase(getClinicById.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      prevState.clinicIdData = action.payload;
    });
    builder.addCase(getClinicById.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      prevState.msg = "faild";
    });
    builder.addCase(getClinicById.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
    });

    // Delete Clinic
    builder.addCase(delteClinicById.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ The Clinic has been Removed.");
    });
    builder.addCase(delteClinicById.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      prevState.msg = "faild";
      toast.error(
        "❌ The Request to remove The Clinic failed. Please try again."
      );
    });
    builder.addCase(delteClinicById.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Update ClinicId
    builder.addCase(updateClinicById.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ Your Clinic Is Updated");
    });
    builder.addCase(updateClinicById.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      prevState.msg = "faild";
      toast.error("❌ Request failed to update Clinic. Please try again.");
    });
    builder.addCase(updateClinicById.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Update ClinicId
    builder.addCase(updateClinicByAdmin.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ Your Clinic Status Is Updated");
    });
    builder.addCase(updateClinicByAdmin.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      prevState.msg = "faild";
      toast.error(
        "❌ Request failed to update Clinic Status. Please try again."
      );
    });
    builder.addCase(updateClinicByAdmin.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Add Doctor To Clinic
    builder.addCase(addDoctorToClinic.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ Doctor was successfully added to the clinic");
    });

    builder.addCase(addDoctorToClinic.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      toast.error("❌ Failed to add doctor to clinic. Please try again.");
      prevState.msg = "failed";
    });

    builder.addCase(addDoctorToClinic.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Adding doctor to clinic...");
    });

    // Get User By Id (for clinic owner)
    builder.addCase(getUserById.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      prevState.ownerInfo = action.payload;
    });
    builder.addCase(getUserById.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      prevState.msg = "failed";
    });
    builder.addCase(getUserById.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
    });
  },
});
export const clinicSlice = x.reducer;
