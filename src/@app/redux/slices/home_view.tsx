import { createSlice } from "@reduxjs/toolkit";
import { loginAction } from "../actions/login_action";

interface State {
  UnseenNoti: any[];
  listNotification: any[];
}
const initialState: State = {
  UnseenNoti: [],
  listNotification: [],
};

const homeViewSlice = createSlice({
  name: "homeview",
  initialState,
  reducers: {
    setReceiveNotifyChangeTemplate: (state, action) => {
      state.UnseenNoti = action.payload.Metadata;
      state.listNotification = action.payload.Data;
      // state.id = action.payload.Id;
      // state.listAppCatePosition = action.payload.appCategories;
      // state.listEventPosition = action.payload.events;
      // state.templateId= action.payload.templateId
    },
  },
});
export const { setReceiveNotifyChangeTemplate } = homeViewSlice.actions;
export default homeViewSlice.reducer;
