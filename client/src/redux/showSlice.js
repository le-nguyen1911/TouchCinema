import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export const fetchNowPlayingMovies = createAsyncThunk(
  "show/fetchNowPlayingMovies",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/show/now-playing", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) return data.movies;
      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchShows = createAsyncThunk(
  "show/fetchShows",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/show/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.success ? data.shows : [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const addShow = createAsyncThunk(
  "show/addShow",
  async (
    { getToken, movieId, dateTimeSelection, showPrice },
    { rejectWithValue }
  ) => {
    try {
      const token = await getToken();

      const showsInput = Object.entries(dateTimeSelection).map(
        ([date, times]) => ({
          date,
          time: times,
        })
      );

      const payload = {
        movieId,
        showsInput,
        showPrice: Number(showPrice),
      };

      const { data } = await axios.post("/api/show/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const fetchShowById = createAsyncThunk(
  "show/fetchShowById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);

      if (data.success) return data;
      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const updateShow = createAsyncThunk(
  "show/updateShow",
  async ({ getToken, showId, date, time, showPrice }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const payload = { date, time, showPrice };

      const { data } = await axios.put(`/api/show/${showId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.success ? data : rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const deleteShow = createAsyncThunk(
  "show/deleteShow",
  async ({ getToken, showId }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await axios.delete(`/api/show/${showId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.success ? showId : rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
const showSlice = createSlice({
  name: "show",
  initialState: {
    shows: [],
    nowPlayingMovies: [],
    addingShow: false,
    addShowResult: null,
    singleShow: null,
  },
  reducers: {
    resetAddShow(state) {
      state.addShowResult = null;
      state.addingShow = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShows.fulfilled, (state, action) => {
        state.shows = action.payload;
      })
      .addCase(fetchNowPlayingMovies.fulfilled, (state, action) => {
        state.nowPlayingMovies = action.payload;
      })
      .addCase(addShow.pending, (state) => {
        state.addingShow = true;
      })
      .addCase(addShow.fulfilled, (state, action) => {
        state.addingShow = false;
        state.addShowResult = action.payload;
      })
      .addCase(addShow.rejected, (state, action) => {
        state.addingShow = false;
        state.addShowResult = { success: false, message: action.payload };
      })
      .addCase(fetchShowById.fulfilled, (state, action) => {
        state.singleShow = action.payload;
      })
        .addCase(updateShow.fulfilled, (state, action) => {
        toast.success("Cập nhật suất chiếu thành công!");
      })
      .addCase(deleteShow.fulfilled, (state, action) => {
        state.shows = state.shows.filter((show) => show._id !== action.payload);
      });
  },
});

export const { resetAddShow } = showSlice.actions;
export default showSlice.reducer;
