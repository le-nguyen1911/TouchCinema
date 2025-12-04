import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice.js";
import showReducer from "./showSlice.js";
import favoriteReducer from "./favoriteSlice.js";
import bookingReducer from "./bookingSlice.js";
import searchReducer from "./searchSlice.js";
import chatAISlice from "./chatAISlice.js";
import userReducer from "./userSlice.js";
import commentReducer from "./commentSlice.js"
export const store = configureStore({
  reducer: {
    admin: adminReducer,
    show: showReducer,
    favorite: favoriteReducer,
    booking: bookingReducer,
    search: searchReducer,
    chatAI: chatAISlice,
    users: userReducer,
    comments: commentReducer,
  },
});
