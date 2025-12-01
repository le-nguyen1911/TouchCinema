import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
export const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

// ====================== GET FAVORITES ==========================
export const fetchFavoriteMovies = createAsyncThunk(
  "favorite/fetchFavoriteMovies",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) return data.movies;

      toast.error(data.message);
      return rejectWithValue(data.message);

    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ====================== UPDATE FAVORITE ==========================
export const updateFavoriteMovie = createAsyncThunk(
  "favorite/updateFavoriteMovie",
  async ({ getToken, movieId }, { rejectWithValue, dispatch }) => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);

        // Refresh lại danh sách yêu thích
        dispatch(fetchFavoriteMovies({ getToken }));
      }

      return data;

    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    favoriteMovies: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteMovies.fulfilled, (state, action) => {
        state.favoriteMovies = action.payload;
      })
      .addCase(updateFavoriteMovie.fulfilled, () => {
      });
  },
});

export default favoriteSlice.reducer;
