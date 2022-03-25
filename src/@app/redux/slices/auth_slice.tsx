import { createSlice } from "@reduxjs/toolkit";
import { loginAction } from "../actions/login_action";

interface State {
  roles: [] | null;
  isLoading: boolean;
}
const initialState: State = {
  roles: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.roles = null;
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
        roles: payload.data.roles,
      };
    });
  },
});
export default authSlice.reducer;
