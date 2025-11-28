import { configureStore } from "@reduxjs/toolkit";
import adminReducer from './adminSlice.js'
import showReducer from './showSlice.js'
import favoriteReducer from './favoriteSlice.js'
import bookingReducer from './bookingSlice.js'
export const store = configureStore({
  reducer: {
    admin: adminReducer,
    show: showReducer,
    favorite: favoriteReducer,
    booking: bookingReducer
  },
});
