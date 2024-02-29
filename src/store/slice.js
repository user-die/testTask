import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "state",
  initialState: {
    value: "",
    currentPage: 3,
    itemPerPage: 50,
  },
  reducers: {
    setState: (state, action) => {
      state.value = action.payload;
    },

    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setState, changePage } = slice.actions;

export default slice.reducer;
