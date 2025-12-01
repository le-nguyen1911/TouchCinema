import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const sendChatMessage = createAsyncThunk(
  "chatAI/sendChatMessage",
  async ({ text, userId }, { rejectWithValue }) => {
    try {
      const res = await fetch("https://touchcinema-server.vercel.app/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userId }),
      });

      const data = await res.json();
      return { sender: "bot", text: data.reply };
    } catch (err) {
      return rejectWithValue("Server không phản hồi");
    }
  }
);

const chatAISlice = createSlice({
  name: "chatAI",
  initialState: {
    messages: [
      {
        sender: "bot",
        text: "Xin chào 👋, mình là trợ lý TouchCinema. Bạn có thể hỏi giờ chiếu, ghế trống, đánh giá phim,...",
      },
    ],
    loading: false,
    error: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        sender: "user",
        text: action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.messages.push({
          sender: "bot",
          text: "Xin lỗi, mình không thể trả lời ngay lúc này.",
        });
      });
  },
});

export const { addUserMessage } = chatAISlice.actions;
export default chatAISlice.reducer;
