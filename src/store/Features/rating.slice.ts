import { ClinicData, RateData, RatingRespone } from "@/types/rating.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import toast from "react-hot-toast";

// Post a new rating
export const createRating = createAsyncThunk(
  "rating/createRating",
  async (values: ClinicData, { getState }) => {
    try {
      const store = getState() as RootState;
      const token = store.userSlice.token;
      const { data } = await axios.post(
        `http://bitary.runasp.net/api/Rating`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

// Get ratings by clinic id
export const getRateByIdClinic = createAsyncThunk(
  "rating/getRateByIdClinic",
  async (clinicId: number) => {
    try {
      const { data } = await axios.get(
        `http://bitary.runasp.net/api/Rating/clinic/${clinicId}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

// Get ratings user
export const getUserRates = createAsyncThunk(
  "rating/getUserRates",
  async (_, state) => {
    const store = state.getState() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Rating/user`,
      method: `GET`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// UPDATE  RATE
export const updateRate = createAsyncThunk(
  "rating/updateRate",
  async (
    { values, rateId }: { values: RateData; rateId: number },
    { getState }
  ) => {
    try {
      const store = getState() as RootState;
      const token = store.userSlice.token;
      const options = {
        url: `http://bitary.runasp.net/api/Rating/${rateId}`,
        method: `PUT`,
        data: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.request(options);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

// DELETE RATE
export const deleteRate = createAsyncThunk(
  "rating/deleteRate",
  async (rateId: number, { getState }) => {
    try {
      const store = getState() as RootState;
      const token = store.userSlice.token;
      const options = {
        url: `http://bitary.runasp.net/api/Rating/${rateId}`,
        method: `DELETE`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.request(options);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

// Get rate By RateID
export const getRateById = createAsyncThunk(
  "rating/getRateById",
  async (id: number) => {
    const options = {
      url: `http://bitary.runasp.net/api/Rating/${id}`,
      method: `GET`,
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Get check rate By ClinicID
export const getRateCheckById = createAsyncThunk(
  "rating/getRateCheckById",
  async (clinicId: number, { getState }) => {
    const store = getState() as RootState;
    const token = store.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Rating/check/${clinicId}`,
      method: `GET`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

const initialState: RatingRespone = {
  // for clinic
  reviewIdClinic: [],

  // for user dashboard
  reviewUserClinic: [],

  ratingDetails: null,
  isError: false,
  isLoading: false,
  idToast: "",
  msg: "",
  checker: false,
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create rating
    builder.addCase(createRating.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.idToast = toast.loading("⏳ Submitting your review...");
    });
    builder.addCase(createRating.fulfilled, (state) => {
      state.isLoading = false;
      toast.dismiss(state.idToast);
      toast.success("✅ Your review was successfully posted!");
    });
    builder.addCase(createRating.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      toast.dismiss(state.idToast);
      toast.error(`❌ ${action.payload}`);
    });

    // Get rating for ClinicId
    builder.addCase(getRateByIdClinic.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(getRateByIdClinic.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reviewIdClinic = action.payload;
    });
    builder.addCase(getRateByIdClinic.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    // GetUserrating
    builder.addCase(getUserRates.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(getUserRates.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reviewUserClinic = action.payload;
    });
    builder.addCase(getUserRates.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    // UPDATE RATE
    builder.addCase(updateRate.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.idToast = toast.loading("⏳ Submitting your review...");
    });
    builder.addCase(updateRate.fulfilled, (state) => {
      state.isLoading = false;
      toast.dismiss(state.idToast);
      toast.success("✅ Review successfully Updated!");
    });
    builder.addCase(updateRate.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      toast.dismiss(state.idToast);
      toast.error("❌ Failed to update review. Please try again.");
    });

    // DELETE RATE BY ADMIN
    builder.addCase(deleteRate.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.idToast = toast.loading("⏳ Submitting your review...");
    });
    builder.addCase(deleteRate.fulfilled, (state) => {
      state.isLoading = false;
      toast.dismiss(state.idToast);
      toast.success("✅ Review successfully deleted!");
    });
    builder.addCase(deleteRate.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      toast.dismiss(state.idToast);
      toast.error("❌ Failed to delete review. Please try again.");
    });

    // Get rate By RateID
    builder.addCase(getRateById.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(getRateById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ratingDetails = action.payload;
    });
    builder.addCase(getRateById.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    // Get check rate By ClinicID
    builder.addCase(getRateCheckById.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(getRateCheckById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.checker=action.payload;
    });
    builder.addCase(getRateCheckById.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export const SliceofRating = ratingSlice.reducer;
