import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ movieId, star }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/comment/${movieId}`, {
        params: { star },
      });

      if (!res.data.success) throw new Error(res.data.message);
      return res.data.comments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ movieId, rating, comment, getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const res = await axios.post(
        "/api/comment/add",
        { movieId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.success) throw new Error(res.data.message);
      return res.data.comment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ commentId, getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const res = await axios.delete(`/api/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data.success) throw new Error(res.data.message);
      return commentId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAllComments = createAsyncThunk(
  "comments/fetchAllComments",
  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const res = await axios.get("/api/comment/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.comments;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchComments.fulfilled, (s, a) => {
        s.loading = false;
        s.comments = a.payload;
      })
      .addCase(fetchComments.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(addComment.fulfilled, (s, a) => {
        s.comments.unshift(a.payload);
      })
      .addCase(deleteComment.fulfilled, (s, a) => {
        s.comments = s.comments.filter((c) => c._id !== a.payload);
      })
      .addCase(fetchAllComments.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchAllComments.fulfilled, (s, a) => {
        s.loading = false;
        s.comments = a.payload;
      })
      .addCase(fetchAllComments.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export default commentSlice.reducer;
