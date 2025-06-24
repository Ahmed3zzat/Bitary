import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { userType } from "@/types/profile.type";
import toast from "react-hot-toast";

export const fetchUserData = createAsyncThunk(
  "profile/fetchUserData",
  async (_, store) => {
    const state = store.getState() as RootState;
    const token = state.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/Authentication/GetUserInformation?email=${localStorage.getItem(
        "email"
      )}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);
const initialState: userType = {
  msg: null,
  user: null,
  idToast: "",
};

const x = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUserData.fulfilled, (prevState, action) => {
      toast.dismiss(prevState.idToast);
      prevState.msg = "success";
      prevState.user = action.payload;
    });
    builder.addCase(fetchUserData.rejected, (prevState, action) => {
      toast.dismiss(prevState.idToast);
      prevState.msg = action.error.message || "Something went wrong";
    });
    builder.addCase(fetchUserData.pending, (prevState) => {
      toast.dismiss(prevState.idToast);
    });
  },
});

export const profileSlice = x.reducer;
