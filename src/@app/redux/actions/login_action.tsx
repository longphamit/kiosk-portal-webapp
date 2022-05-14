import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInService } from "../../services/auth_service";

export const loginAction = createAsyncThunk(
  "user/login",
  async (arg: { email: string; password: string }) => {
    const { email, password } = arg;
    const result = await signInService(email,password);
    return result;
  }
);
