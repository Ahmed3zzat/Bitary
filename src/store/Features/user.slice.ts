import { jwtDecode } from "jwt-decode";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { userType } from "@/types/user.type";
import { checkAndSaveDoctorId } from "./doctor.slice";

// Admin order types
export type AdminOrder = {
  id: string;
  userEmail: string;
  orderDate: string;
  status: string;
  deliveryMethod: string;
  subtotal: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    country: string;
  };
};

export type AdminOrdersResponse = {
  orders: AdminOrder[];
  pagination: {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
};

// Create Signup
export const setSignup = createAsyncThunk(
  "user/setSignup",
  async (
    values: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      rePassword?: string;
      userName: string;
      phoneNumber: string;
      gender: number;
      userRole: number;
    },
    thunkAPI
  ) => {
    delete values.rePassword;
    const options = {
      url: "http://bitary.runasp.net/api/Authentication/Register",
      method: "POST",
      data: values,
    };
    const { data } = await axios.request(options);

    // After successful signup, check if the user is a doctor
    thunkAPI.dispatch(checkAndSaveDoctorId());

    return data;
  }
);

// Create Login
export const setLogin = createAsyncThunk(
  "user/setLogin",
  async (values: { email: string; password: string }, thunkAPI) => {
    const options = {
      url: "http://bitary.runasp.net/api/Authentication/Login",
      method: "POST",
      data: values,
    };
    const { data } = await axios.request(options);

    // Save the login token
    if (typeof window !== "undefined") {
      window.localStorage.setItem("token", data.token);
    }

    // After successful login, check if the user is a doctor
    try {
      const doctorOptions = {
        url: "http://bitary.runasp.net/api/Doctor/GetDoctorProfile",
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      };

      const doctorResponse = await axios.request(doctorOptions);

      if (doctorResponse.data && doctorResponse.data.id) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "doctorId",
            doctorResponse.data.id.toString()
          );
          console.log("Doctor ID saved during login:", doctorResponse.data.id);
        }
      }
    } catch {
      // User is not a doctor - this is fine
      console.log("User is not a doctor");
    }

    // Also dispatch the regular doctor check
    thunkAPI.dispatch(checkAndSaveDoctorId());

    return data;
  }
);

// Create Send Password
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

// Reset Password
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

// Check Email Exist
export const checkEmailExist = createAsyncThunk(
  "user/checkEmailExist",
  async (email: string) => {
    const options = {
      url: `http://bitary.runasp.net/api/Authentication/CheckEmailExist?email=${email}`,
      method: "GET",
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Admin Get All Orders
export const getAllOrders = createAsyncThunk(
  "user/getAllOrders",
  async ({ pageNumber = 1, pageSize = 10 }: { pageNumber?: number; pageSize?: number }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Ensure pageNumber is at least 1 and explicitly set
    const page = Math.max(1, pageNumber);
    
    // Build URL with explicit pageNumber parameter
    const url = `http://bitary.runasp.net/api/Orders/admin/all-orders?pageNumber=${page}&pageSize=${pageSize}`;
    
    const options = {
      url,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    
    console.log(`API Request URL: ${options.url}`);
    
    const { data } = await axios.request(options);
    console.log('API Response pagination:', data.pagination);
    return data as AdminOrdersResponse;
  }
);

// Admin Update Order Status
export const updateOrderStatus = createAsyncThunk(
  "user/updateOrderStatus",
  async ({ orderId, status }: { orderId: string; status: number }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const options = {
      url: "http://bitary.runasp.net/api/Payments/admin/status",
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { orderId, status },
    };
    
    const { data } = await axios.request(options);
    return { orderId, status, response: data };
  }
);

const initialState: userType = {
  msg: "",
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: typeof window !== "undefined" ? localStorage.getItem("userRole") : null,
  isLoading: false,
  isError: false,
  idToast: "",
  emailExist: "",
  isCorrect: false,
};

// Initialize state with localStorage values on client side only
if (typeof window !== "undefined") {
  initialState.token = localStorage.getItem("token");
  initialState.user = localStorage.getItem("userRole");
}

const USlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken(state, action: { payload: string }) {
      state.token = action.payload;
    },
    logout(state) {
      state.token = null;
      // Clear all user-related data from localStorage
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("doctorId");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userRole");
      }
    },
  },
  extraReducers: (builder) => {
    // Create Signup
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

    // Create Login
    builder.addCase(setLogin.fulfilled, (prevState, action) => {
      prevState.isError = false;
      prevState.isLoading = false;
      prevState.msg = "success";
      prevState.token = action.payload.token;
      toast.success("✅ Login successfully!");

      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);

        const decoded = jwtDecode<{
          role?: number;
          id?: string;
          email?: string;
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?:
            | string
            | string[];
        }>(action.payload.token);

        const roleClaim =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        if (Array.isArray(roleClaim)) {
          if (roleClaim[0] == "Admin") {
            localStorage.setItem("userRole", "2");
            prevState.user = "2";
          } else if (roleClaim[0] == "Doctor") {
            localStorage.setItem("userRole", "1");
            prevState.user = "1";
          } else if (roleClaim[0] == "PetOwner") {
            localStorage.setItem("userRole", "0");
            prevState.user = "0";
          }
        } else{
          if (roleClaim == "Admin") {
            localStorage.setItem("userRole", "2");
            prevState.user = "2";
          } else if (roleClaim == "Doctor") {
            localStorage.setItem("userRole", "1");
            prevState.user = "1";
          } else if (roleClaim == "PetOwner") {
            localStorage.setItem("userRole", "0");
            prevState.user = "0";
          }
        }
      }

      toast.dismiss(prevState.idToast);
    });
    builder.addCase(setLogin.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again.");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(setLogin.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Create Send Password
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

    // Reset Password
    builder.addCase(setResetPassword.fulfilled, (prevState, action) => {
      prevState.isError = false;
      prevState.isLoading = false;
      prevState.msg = "success";
      toast.success(`✅ ${action.payload.message}`);
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(setResetPassword.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again.");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(setResetPassword.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Reset Password
    builder.addCase(checkEmailExist.fulfilled, (prevState, action) => {
      prevState.isError = false;
      prevState.isLoading = false;
      prevState.msg = "success";
      if (action.payload == true) {
        prevState.isCorrect = true;
        prevState.emailExist = "email already exist, enter another email";
      } else {
        prevState.emailExist = "";
        prevState.isCorrect = false;
      }
    });
    builder.addCase(checkEmailExist.rejected, () => {});
    builder.addCase(checkEmailExist.pending, () => {});
  },
});

export const userSlice = USlice.reducer;
export const { setToken, logout } = USlice.actions;
