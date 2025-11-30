import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    showSearch: false, 
    keyword: "",       
  },
  reducers: {
    toggleSearch: (state) => {
      state.showSearch = !state.showSearch;
    },
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
  },
});

export const { toggleSearch, setKeyword } = searchSlice.actions;
export default searchSlice.reducer;
