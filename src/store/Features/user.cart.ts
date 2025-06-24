import { RootState } from "@/store/store";
import { Basket } from "@/types/cart.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";


// Create Cart
export const createCart = createAsyncThunk(
  "cart/createCart",
  async (_, store) => {
    const state = store.getState() as RootState;
    const token = state.userSlice.token;
    const options = {
      url: `http://bitary.runasp.net/api/basket`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// checkCartExist || get Items in my cart
export const getCartById = createAsyncThunk(
  "cart/getCartById",
  async (_, store) => {
    const state = store.getState() as RootState;
    const pasketId = state.userCartSlice.id;
    const options = {
      url: `http://bitary.runasp.net/api/basket/${pasketId}`,
      method: "GET",
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Add ItemCart
export const addItemCart = createAsyncThunk(
  "cart/addItemCart",
  async ({ productId, quantity }: { productId: number; quantity: number }, { getState }) => {
    const state = getState() as RootState;
    const basketId = state.userCartSlice.id;

    const options = {
      url: `http://bitary.runasp.net/api/Basket/${basketId}/items`,
      method: "POST",
      data: {
        productId,
        quantity,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Delete Item By ID From Cart
export const delteItemCart = createAsyncThunk(
  "cart/delteItemCart",
  async (itemId: number, { getState }) => {
    const state = getState() as RootState;
    const basketId = state.userCartSlice.id;
    // console.log(basketId);

    const options = {
      url: `http://bitary.runasp.net/api/Basket/${basketId}/items/${itemId}`,
      method: "DELETE",
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Update Quantaty
export const updateQuantaty = createAsyncThunk(
  "cart/updateQuantaty",
  async (updateValue: { itemId: number; quantity: number }, { getState }) => {
    const state = getState() as RootState;
    const basketId = state.userCartSlice.id;
    const options = {
      url: `http://bitary.runasp.net/api/Basket/${basketId}/items/${updateValue.itemId}`,
      method: "PUT",
      data: {
        quantity: updateValue.quantity,
      },
    };
    const { data } = await axios.request(options);
    return data;
  }
);

// Delete Cart
export const delteCart = createAsyncThunk(
  "cart/delteCart",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const basketId = state.userCartSlice.id;
    const options = {
      url: `http://bitary.runasp.net/api/Basket/${basketId}`,
      method: "DELETE",
    };
    const { data } = await axios.request(options);
    return data;
  }
);

const initialState: Basket = {
  id: typeof window !== 'undefined' ? localStorage.getItem("basketId") : null,
  items: null,
  paymentIntentId: null,
  clientSecret: null,
  deliveryMethodId: null,
  shippingPrice: null,
  idToast: "",
  isError: false,
  isLoading: false,
  checkBasketExist: false,
  totalPrice: 0,
  itemsLength: 0
};

const x = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = null;
      state.id = null;
      state.itemsLength = 0;
      state.totalPrice = 0;
      state.checkBasketExist = false;
    }
  },
  extraReducers(builder) {
    // Create Basket
    builder.addCase(createCart.fulfilled, (prevState, action) => {
      localStorage.setItem("basketId", action.payload.basketId);
      prevState.id = action.payload.basketId;
      prevState.checkBasketExist = true;
      prevState.items = null; // Clear any old items when creating new cart
      prevState.itemsLength = 0;
    });

    // Check Cart Exist || Get Items
    builder.addCase(getCartById.fulfilled, (prevState, action) => {
      if (!prevState.id) {
        // If no basketId exists, clear the cart state
        prevState.items = null;
        prevState.itemsLength = 0;
        prevState.checkBasketExist = false;
        return;
      }
      prevState.items = action.payload.items;
      prevState.itemsLength = action.payload.items?.length || 0; 
      prevState.checkBasketExist = true;
    });
    
    builder.addCase(getCartById.rejected, (prevState) => {
      prevState.checkBasketExist = false;
      prevState.items = null;
      prevState.itemsLength = 0;
      localStorage.removeItem("basketId"); // Remove invalid basketId
    });

    // AddToBasket
    builder.addCase(addItemCart.fulfilled, (prevState) => {
      toast.success("✅ Product has been added to Cart");
      toast.dismiss(prevState.idToast);
    });

    builder.addCase(addItemCart.rejected, (prevState, action) => {
      console.log("error in add");
      console.log(action);
      toast.error("❌ Request failed. Please try again.");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(addItemCart.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // RemoveItemFromBasket
    builder.addCase(delteItemCart.fulfilled, (prevState) => {
      toast.success("✅ Product has been deleted");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(delteItemCart.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again to delete product.");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(delteItemCart.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // UpdateItemFromBasket
    builder.addCase(updateQuantaty.fulfilled, (prevState, action) => {
      console.log(action);

      toast.success("✅ Product has been updated");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(updateQuantaty.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again to upddate product.");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(updateQuantaty.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });

    // Delete Cart
    builder.addCase(delteCart.fulfilled, (prevState) => {
      prevState.items=[];
      localStorage.removeItem("basketId");
      toast.success("✅ Your Shopping Cart has been deleted");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(delteCart.rejected, (prevState) => {
      toast.error("❌ Request failed. Please try again to clear Your Cart.");
      toast.dismiss(prevState.idToast);
    });
    builder.addCase(delteCart.pending, (prevState) => {
      prevState.idToast = toast.loading("⏳ Processing your request...");
    });
  },
});

export const userCartSlice = x.reducer;
export const { clearCartState } = x.actions;
