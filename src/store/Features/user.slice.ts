import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { userType } from "@/types/user.type";

export const setSignup = createAsyncThunk(
  "user/setSignup",
  async (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    rePassword?: string;
    userName: string;
    phoneNumber: string;
    gender: number;
  }) => {
    delete values.rePassword;
    const options = {
      url: "http://bitary.runasp.net/api/Authentication/Register",
      method: "POST",
      data: values,
    };
    const { data } = await axios.request(options);

    return data;
  }
);

export const setLogin = createAsyncThunk(
  "user/setLogin",
  async (values: { email: string; password: string }) => {
    const options = {
      url: "http://bitary.runasp.net/api/Authentication/Login",
      method: "POST",
      data: values,
    };
    const { data } = await axios.request(options);
    return data;
  }
);

export const setSendPassword = createAsyncThunk(
  "user/setSendPassword",
  async (values: { email: string }) => {
    const options = {
      url: `http://bitary.runasp.net/api/Authentication/SendResetPasswordEmail?email=${values.email}`,
      method: "POST",
    };
    const { data } = await axios.request(options);

    return data;
  }
);

export const setResetPassword = createAsyncThunk(
  "user/setResetPassword",
  async (values: { email: string; token: string; newPassword: string }) => {
    const options = {
      url: `http://bitary.runasp.net/api/Authentication/ResetPassword?email=${values.email}&token=${values.token}&newPassword=${values.newPassword}`,
      method: "POST",
    };
    const { data } = await axios.request(options);

    return data;
  }
);

const initialState: userType = {
  msg: "",
  token: localStorage.getItem("token"),
  isLoading: false,
  isError: false,
  idToast: "",
};

const USlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(prevState) {
      prevState.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setSignup.fulfilled, (prevState, action) => {
      prevState.isError = false;
      prevState.isLoading = false;
      prevState.msg = "success";
      toast.success("✅ Account created successfully!");
      localStorage.setItem("token", action.payload.token);
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(setSignup.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again.");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(setSignup.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    builder.addCase(setLogin.fulfilled, (prevState, action) => {
      prevState.isError = false;
      prevState.isLoading = false;
      prevState.msg = "success";
      toast.success("✅ Login successfully!");
      localStorage.setItem("token", action.payload.token);
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(setLogin.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again.");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(setLogin.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    builder.addCase(setSendPassword.fulfilled, (prevState, action) => {
      prevState.isError = false;
      prevState.isLoading = false;
      prevState.msg = "success";
      toast.success(`✅ ${action.payload.message}`);
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(setSendPassword.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again.");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(setSendPassword.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    builder.addCase(setResetPassword.fulfilled, (prevState, action) => {
      prevState.isError = false;
      prevState.isLoading = false;
      prevState.msg = "success";
      toast.success(`✅ ${action.payload.message}`);
      toast.dismiss(prevState.idToast);
      console.log(action);
    });
    builder.addCase(setResetPassword.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again.");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(setResetPassword.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });
  },
});

export const userSlice = USlice.reducer;
export const {logout} = USlice.actions;
