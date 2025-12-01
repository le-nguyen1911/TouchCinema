import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async ({ limit = 20, offset = 0, getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const res = await axios.get(
        `/api/user/all-user?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      if (!data.success) throw new Error(data.message);

      return data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    error: null,
    total: 0,
    list: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải danh sách user.";
      });
  },
});

export default userSlice.reducer;
