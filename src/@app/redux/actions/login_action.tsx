import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInService } from "../../services/auth_service";

export const loginAction = createAsyncThunk(
  "user/login",
  async (arg: { username: string; password: string }) => {
    const { username, password } = arg;
    const result = await signInService(username,password);
    return result;
  }
);
