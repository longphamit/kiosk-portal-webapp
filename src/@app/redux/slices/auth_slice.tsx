import { createSlice } from "@reduxjs/toolkit";
import { loginAction } from "../actions/login_action";

interface State {
  role: [] | null;
  isLoading: boolean;
}
const initialState: State = {
  role: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAction.pending, (state) => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(loginAction.fulfilled, (state, { payload }) => {
      return {
        ...state,
        isLoading: false,
      //  role: payload.data.roleName,
      };
    });
  },
});
export default authSlice.reducer;
