import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

/* ======================
   GET MY BOOKINGS (CÓ TOKEN)
====================== */
export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMyBookings",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) return data.bookings;

      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ======================
   GET OCCUPIED SEATS (CÓ TOKEN)
====================== */
export const fetchOccupiedSeats = createAsyncThunk(
  "booking/fetchOccupiedSeats",
  async ({ showId, getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await axios.get(`/api/booking/seats/${showId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) return data.occupiedSeats;

      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
//  BOOK TICKET
export const bookTickets = createAsyncThunk(
  "booking/bookTickets",
  async ({ getToken, showId, seats }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        "/api/booking/create",
        {
          showId,
          selectedSeats: seats, // 🔥 FIX QUAN TRỌNG
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) return data;

      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const createVnpayPayment = createAsyncThunk(
  "booking/createVnpayPayment",
  async ({ bookingId, getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        "/api/payment/create",
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) return data.paymentUrl;
      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    myBookings: [],
    occupiedSeats: [],
    loading: false,
    bookingLoading: false,
    bookingSuccess: false,
    paymentUrl: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* Fetch My Bookings */
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.myBookings = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyBookings.rejected, (state) => {
        state.loading = false;
      })

      /* Fetch Occupied Seats */
      .addCase(fetchOccupiedSeats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOccupiedSeats.fulfilled, (state, action) => {
        state.occupiedSeats = action.payload;
        state.loading = false;
      })
      .addCase(fetchOccupiedSeats.rejected, (state) => {
        state.loading = false;
      })
      /* Book Tickets */
      .addCase(bookTickets.pending, (state) => {
        state.bookingLoading = true;
        state.bookingSuccess = false;
      })
      .addCase(bookTickets.fulfilled, (state) => {
        state.bookingLoading = false;
        state.bookingSuccess = true;
      })
      .addCase(bookTickets.rejected, (state) => {
        state.bookingLoading = false;
        state.bookingSuccess = false;
      })
      .addCase(createVnpayPayment.fulfilled, (state, action) => {
        state.paymentUrl = action.payload;
      });
  },
});

export default bookingSlice.reducer;
