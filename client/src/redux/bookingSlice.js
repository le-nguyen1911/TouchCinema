import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
export const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

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
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async ({ bookingId, getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await axios.delete(`/api/booking/cancel/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) return bookingId;

      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const updateBookingByAdmin = createAsyncThunk(
  "booking/updateBookingByAdmin",
  async (
    { bookingId, selectedSeats, isPaid, getToken },
    { rejectWithValue }
  ) => {
    try {
      const token = await getToken();

      const { data } = await axios.put(
        `/api/booking/admin/update/${bookingId}`,
        {
          selectedSeats,
          isPaid,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) return data.booking;

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
      })
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = state.myBookings.filter(
          (b) => b._id !== action.payload
        );
      })
      .addCase(cancelBooking.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateBookingByAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBookingByAdmin.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.myBookings.findIndex(
          (b) => b._id === action.payload._id
        );

        if (index !== -1) {
          state.myBookings[index] = action.payload;
        }
      })
      .addCase(updateBookingByAdmin.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default bookingSlice.reducer;
