import { productResponse } from "@/types/products.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getProduts = createAsyncThunk(
  "products/getProduts",
  async ({ sort = '', pageIndex = 1, search ='',pageSize= 10 }: { sort: string; pageIndex: number; search: string, pageSize: number }) => {
    const options = {
      url: `http://bitary.runasp.net/api/Products?search=${search}&sort=${sort}&PageIndex=${pageIndex}&PageSize=${pageSize}`,
      method: "GET",
    };
    const { data } = await axios.request(options);
    return data;
  }
);

const initialState: productResponse = {
  msg: "",
  idToast: "",
  products: null,
  isError: false,
  isLoading: false,
};

const x = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getProduts.fulfilled, (prevState, action) => {
      prevState.isError = false;
      prevState.isLoading = false;
      prevState.msg = "success";
      prevState.products = action.payload.data;
    });
    builder.addCase(getProduts.rejected, (prevState, action) => {
      prevState.isError = true;
      prevState.isLoading = false;
      prevState.msg = action.error.message || "Something went wrong";
    });
    builder.addCase(getProduts.pending, (prevState) => {
      prevState.isError = false;
      prevState.isLoading = true;
    });
  },
});

export const productSlice = x.reducer;
