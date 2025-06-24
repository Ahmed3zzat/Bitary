import { RootState } from "@/store/store";
import { wishlistRespone } from "@/types/wishlist.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// getWishList
export const getWishList = createAsyncThunk(
  "wishlist/getWishList",
  async (_, store) => {
    const state = store.getState() as RootState;
    const token = state.userSlice.token;

    const options = {
      url: `http://bitary.runasp.net/api/WishList`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Add ProductToWishlist
export const AddProductToWishList = createAsyncThunk(
  "wishlist/AddProductToWishList",
  async (productId: number, { getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/WishList/items`,
      method: "POST",
      data: { productId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Delete Item By ID From wishlist
export const delteItemWishlist = createAsyncThunk(
  "wishlist/delteItemWishlist",
  async (ProductId: number, { getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    // console.log(basketId);
    const options = {
      url: `http://bitary.runasp.net/api/WishList/items/${ProductId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Check Item Wishlist ID
export const checkItemWishlist = createAsyncThunk(
  "wishlist/checkItemWishlist",
  async (ProductId: number, { getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    // console.log(basketId);
    const options = {
      url: `http://bitary.runasp.net/api/WishList/check/${ProductId}`,
      method: "Get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Check Item Wishlist ID
export const redHeart = createAsyncThunk(
  "wishlist/checkItemWishlist",
  async (ProductId: number, { getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    // console.log(basketId);
    const options = {
      url: `http://bitary.runasp.net/api/WishList/check/${ProductId}`,
      method: "Get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Clear All Items in wishlist
export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/WishList`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

const initialState: wishlistRespone = {
  WishListData: null,
  isError: false,
  isLoading: false,
  idToast: ``,
  msg: ``,
  checkExist: false,
};
const x = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // getWishList
    builder.addCase(getWishList.fulfilled, (prevState, action) => {
      prevState.isError = false;
      prevState.isLoading = false;
      prevState.WishListData = action.payload;
    });
    builder.addCase(getWishList.rejected, (prevState) => {
      prevState.isError = true;
      prevState.isLoading = false;
    });
    builder.addCase(getWishList.pending, (prevState) => {
      prevState.isError = false;
      prevState.isLoading = true;
    });

    // AddToWishlist
    builder.addCase(AddProductToWishList.fulfilled, (prevState) => {
      toast.success("✅ Product has been added to Wishlist");
      toast.dismiss(prevState.idToast);
      prevState.isError = false;
      prevState.isLoading = false;
    });
    builder.addCase(AddProductToWishList.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again.");
      toast.dismiss(prevState.idToast);
      prevState.isError = true;
      prevState.isLoading = false;
    });
    builder.addCase(AddProductToWishList.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");

      prevState.isLoading = true;
    });

    // Delete Item By ID From wishlist
    builder.addCase(delteItemWishlist.fulfilled, (prevState) => {
      toast.success("Item removed from wishlist");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(delteItemWishlist.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again to delete product.");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(delteItemWishlist.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Clear All Items in wishlist
    builder.addCase(clearWishlist.fulfilled, (prevState) => {
      toast.success("Wishlist cleared successfully");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(clearWishlist.rejected, (prevState) => {
      toast.error(
        "❌ Request failed. Please try again to clear Your Wishlist."
      );
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(clearWishlist.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Check Item Wishlist ID
    builder.addCase(checkItemWishlist.fulfilled, (prevState, action) => {
      if (action.payload == true) {
        toast.success("The Product is already in Wishlist");
        prevState.checkExist = true;
      } else {
        toast.error("The Product is not already in Wishlist");
        prevState.checkExist = false;
      }
      toast.dismiss(prevState.idToast);
      prevState.isError = false;
      prevState.isLoading = false;
    });
    builder.addCase(checkItemWishlist.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again to check");
      toast.dismiss(prevState.idToast);
      prevState.isError = true;
      prevState.isLoading = false;
    });
    builder.addCase(checkItemWishlist.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
      prevState.isLoading = true;
    });

  },
});

export const userWishlisttSlice = x.reducer;
