import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

// CHECK ADMIN
export const fetchIsAdmin = createAsyncThunk(
  "admin/fetchIsAdmin",
  async ({ getToken, location, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        toast.error("Bạn không có quyền truy cập");
        navigate("/");
      }

      return data.isAdmin;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// GET DASHBOARD DATA
export const fetchDashboardData = createAsyncThunk(
  "admin/fetchDashboardData",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.success) {
        toast.error(data.message);
        return rejectWithValue(data.message);
      }

      return data.dashboardData;
    } catch (err) {
      toast.error("Lỗi tải Dashboard");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// ADMIN GET ALL SHOWS
export const fetchAdminAllShows = createAsyncThunk(
  "admin/fetchAdminAllShows",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/admin/all-shows", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.shows;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const fetchAdminAllBookings = createAsyncThunk(
  "admin/fetchAdminAllBookings",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/admin/all-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.bookings; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isAdmin: false,
    dashboardData: null,
    loadingDashboard: true,
    adminShows: [],
    loadingAdminShows: true,
    adminBookings: [],
    loadingAdminBookings: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CHECK ADMIN
      .addCase(fetchIsAdmin.fulfilled, (state, action) => {
        state.isAdmin = action.payload;
      })

      // DASHBOARD
     .addCase(fetchDashboardData.pending, (state) => {
        state.loadingDashboard = true;
      })

      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.dashboardData = action.payload;
        state.loadingDashboard = false;    
      })

      .addCase(fetchDashboardData.rejected, (state) => {
        state.loadingDashboard = false;
      })
      // --- ALL SHOWS ---
      .addCase(fetchAdminAllShows.pending, (state) => {
        state.loadingAdminShows = true;
      })
      .addCase(fetchAdminAllShows.fulfilled, (state, action) => {
        state.adminShows = action.payload;
        state.loadingAdminShows = false;
      })
      .addCase(fetchAdminAllShows.rejected, (state) => {
        state.loadingAdminShows = false;
      })
      .addCase(fetchAdminAllBookings.pending, (state) => {
        state.loadingAdminBookings = true;
      })
      .addCase(fetchAdminAllBookings.fulfilled, (state, action) => {
        state.adminBookings = action.payload;
        state.loadingAdminBookings = false;
      })
      .addCase(fetchAdminAllBookings.rejected, (state) => {
        state.loadingAdminBookings = false;
      });
  },
});

export default adminSlice.reducer;
