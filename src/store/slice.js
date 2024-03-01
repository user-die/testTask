import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";

const timestamp = new Date().toISOString().slice(0, 10).split("-").join(""),
  data = `Valantis_${timestamp}`,
  authorizationString = CryptoJS.MD5(data).toString();

export const fetchAllitems = createAsyncThunk(
  "state/fetchAllitems",
  async function (_, { rejectWithValue }) {
    try {
      const response = await fetch("https://api.valantis.store:41000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": authorizationString,
        },
        body: JSON.stringify({
          action: "get_ids",
        }),
      });

      if (!response.ok) throw new Error("ServerError!");

      const data = await response.json();

      return data.result;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentItems = createAsyncThunk(
  "state/fetchCurrentItems",
  async function (items, { rejectWithValue }) {
    try {
      const response = await fetch("https://api.valantis.store:41000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": authorizationString,
        },
        body: JSON.stringify({
          action: "get_items",
          params: { ids: items },
        }),
      });

      if (!response.ok) throw new Error("ServerError!");

      const data = await response.json();

      return data.result;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

const slice = createSlice({
  name: "state",
  initialState: {
    allItems: "",
    currentItems: "",
    currentPage: 1,
    itemPerPage: 50,
    error: null,
    status: null,
  },
  reducers: {
    setState: (state, action) => {
      state.allItems = action.payload;
    },

    changePage: (state, action) => {
      state.currentPage = action.payload;
    },

    /*
    setCurrentItems: (state, action) => {
      state.currentItems = action.payload;
    },*/
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllitems.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(fetchAllitems.fulfilled, (state, { payload }) => {
      state.status = "resolved";
      state.allItems = payload;
    });

    builder.addCase(fetchAllitems.rejected, (state, { payload }) => {
      state.status = "rejected";
      state.error = payload;
    });

    builder.addCase(fetchCurrentItems.fulfilled, (state, { payload }) => {
      state.status = "resolved";
      state.currentItems = payload;
    });

    builder.addCase(fetchCurrentItems.rejected, (state, { payload }) => {
      state.status = "rejected";
      state.error = payload;
    });
  },
});

export const { setState, changePage } = slice.actions;

export default slice.reducer;
