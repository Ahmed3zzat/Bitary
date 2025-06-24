import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";
import { Pet, petRespone, UpdatePetIdArgs } from "@/types/pet.type";
import toast from "react-hot-toast";

// Create Pet
export const createPet = createAsyncThunk(
  "Pet/createPet",
  async (
    values: {
      petName: string;
      birthDate: string;
      gender: number;
      type: number;
      color: string;
      avatar: string|null|File;
    },
    state
  ) => {
    const store = state.getState() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Pet`,
      method: `POST`,
      data: values,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

export const getUserPets = createAsyncThunk(
  "Pet/getUserPets",
  async (_, state) => {
    const store = state.getState() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Pet/user`,
      method: `GET`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

export const getPetId = createAsyncThunk<
  Pet,
  number,
  { state: RootState }
>(
  "Pet/getPetId",
  async (petId, thunkAPI) => {
    const store = thunkAPI.getState();
    const token = store.userSlice.token;

    const options = {
      url: `http://bitary.runasp.net/api/Pet/${petId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      return data;
    } catch (error) {
      console.log("Error fetching pet details");
      throw error;
    }
  }
);

export const updatePetId = createAsyncThunk(
  "Pet/updatePetId",
  async ({ values, petId }: UpdatePetIdArgs, state) => {
    const store = state.getState() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Pet/${petId}`,
      method: `PUT`,
      data: values,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options)
      console.log(data);
      
    return data;
  }
);

export const deletePetId = createAsyncThunk(
  "Pet/deletePetId",
  async ( petId:number , state) => {
    const store = state.getState() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Pet/${petId}`,
      method: `DELETE`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    console.log(data);
    return data;
  }
);

// Get Pet Medical Records
export const getPetMedicalRecords = createAsyncThunk(
  "Pet/getPetMedicalRecords",
  async (petId: number, state) => {
    const store = state.getState() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/MedicalRecord/pet/${petId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.request(options);
      return data;
    } catch (error) {
      console.log("Error fetching pet medical records");
      throw error;
    }
  }
);

// Get Pet Appointments
export const getPetAppointments = createAsyncThunk(
  "Pet/getPetAppointments",
  async (petId: number, state) => {
    const store = state.getState() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Appointment/pet/${petId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.request(options);
      return data;
    } catch (error) {
      console.log("Error fetching pet appointments");
      throw error;
    }
  }
);

const initialState: petRespone = {
  PetList: null,
  medicalRecords: null,
  appointments: null,
  isError: false,
  isLoading: false,
  idToast: ``,
  msg: ``,
};

const x = createSlice({
  name: "Pet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Pet
    builder.addCase(createPet.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ The Pet Was Created");
    });
    builder.addCase(createPet.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      toast.error("❌ The Request To Add A Pet Failed. Please Try Again.");
      prevState.msg = "faild";
    });
    builder.addCase(createPet.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Get User Pets
    builder.addCase(getUserPets.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      prevState.PetList=action.payload;
    });
    builder.addCase(getUserPets.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
     prevState.msg = "faild";
    });
    builder.addCase(getUserPets.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
    });

    // Update PetId
    builder.addCase(updatePetId.fulfilled, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ Your Pet Is Updated");
    });
    builder.addCase(updatePetId.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      prevState.msg = "faild";
      toast.error("❌ Request failed. Please try again.");
    });
    builder.addCase(updatePetId.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Get PetId
    // builder.addCase(getPetId.fulfilled, (prevState, action) => {});
    // builder.addCase(getPetId.rejected, (prevState) => {});
    // builder.addCase(getPetId.pending, () => {});


    builder.addCase(getPetId.fulfilled, (state, action) => {
      state.isError = false;
      state.isLoading = false;
      state.msg = "success";

      // Store the fetched pet data
      if (action.payload) {
        // If PetList is currently an array, update or add the pet
        if (Array.isArray(state.PetList)) {
          const existingIndex = state.PetList.findIndex(pet => pet.id === action.payload.id);
          if (existingIndex >= 0) {
            // Update existing pet
            state.PetList[existingIndex] = action.payload;
          } else {
            // Add new pet to the array
            state.PetList.push(action.payload);
          }
        } else {
          // If PetList is null or a single pet, set it as an array with this pet
          state.PetList = [action.payload];
        }
      }
    });
    builder.addCase(getPetId.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(getPetId.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.msg = "failed";
    });

    // Delete PetId
    builder.addCase(deletePetId.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.msg = "success";
      toast.dismiss(prevState.idToast);
      toast.success("✅ The Pet Has Been Removed.");
      console.log(action);
      
    });
    builder.addCase(deletePetId.rejected, (prevState,action) => {
      prevState.isLoading = false;
      prevState.isError = true;
      toast.dismiss(prevState.idToast);
      prevState.msg = "faild";
      toast.error("❌ The Request To Remove The Pet Failed. Please Try Again.");
      console.log(action);
      
    });
    builder.addCase(deletePetId.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Get Pet Medical Records
    builder.addCase(getPetMedicalRecords.fulfilled, (prevState, action) => {
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.medicalRecords = action.payload;
      prevState.msg = "success";
    });
    builder.addCase(getPetMedicalRecords.rejected, (prevState) => {
      prevState.isLoading = false;
      prevState.isError = true;
      prevState.medicalRecords = null;
      prevState.msg = "failed";
    });
    builder.addCase(getPetMedicalRecords.pending, (prevState) => {
      prevState.isLoading = true;
      prevState.isError = false;
    });

    // Get Pet Appointments
    builder.addCase(getPetAppointments.fulfilled, (prevState, action) => {
      console.log("🎉 Pet appointments fulfilled in reducer:", {
        payload: action.payload,
        payloadType: typeof action.payload,
        isArray: Array.isArray(action.payload),
        length: Array.isArray(action.payload) ? action.payload.length : 'N/A'
      });
      prevState.isLoading = false;
      prevState.isError = false;
      prevState.appointments = action.payload;
      prevState.msg = "success";
    });
    builder.addCase(getPetAppointments.rejected, (prevState, action) => {
      console.error("💥 Pet appointments rejected in reducer:", {
        error: action.error,
        payload: action.payload
      });
      prevState.isLoading = false;
      prevState.isError = true;
      prevState.appointments = null;
      prevState.msg = action.error.message || "failed";
    });
    builder.addCase(getPetAppointments.pending, (prevState) => {
      console.log("⏳ Pet appointments pending in reducer");
      prevState.isLoading = true;
      prevState.isError = false;
    });
  },
});
export const petSlice = x.reducer;
