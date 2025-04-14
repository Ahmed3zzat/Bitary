import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./Features/user.slice";
import { productSlice } from "./Features/user.product";

export const store = configureStore({
  reducer: {
    userSlice,
    productSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
