import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupCount: 0,
  billingCount: 0,
  usersCount: 0,
  addtoCarts: 0,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.signupCount = action.payload.signupCount;
      state.billingCount = action.payload.billingCount;
      state.usersCount = action.payload.usersCount;
      state.addtoCarts = action.payload.addtoCarts;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUserData, setLoading } = userSlice.actions;

export default userSlice.reducer;
