import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./Features/user.slice";
import { productSlice } from "./Features/user.product";
import { profileSlice } from "./Features/profile.slice";
import { userCartSlice } from "./Features/user.cart";
import { petSlice } from "./Features/user.pets";
import { clinicSlice } from "./Features/clinic.slice";

import { SliceofRating } from "./Features/rating.slice";


import doctorSlice from "./Features/doctor.slice";
import { userWishlisttSlice } from "./Features/wishlist";
import appointmentSlice from "./Features/appointment.slice";


export const store = configureStore({
  reducer: {
    userSlice,
    productSlice,
    profileSlice,
    userCartSlice,
    petSlice,
    clinicSlice,
    SliceofRating,
    doctorSlice,
    userWishlisttSlice,
    appointmentSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
