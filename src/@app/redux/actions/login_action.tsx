import { createAsyncThunk } from "@reduxjs/toolkit";
import { getTokenCustom } from "../../../kiosk_portal/configs/firebase";
import { signInService } from "../../services/auth_service";

export const loginAction = createAsyncThunk(
  "user/login",
  async (arg: { email: string; password: string }) => {
    const { email, password } = arg;
    const deviceId=await getTokenCustom();
    const result = await signInService(email,password,deviceId);
    return result;
  }
);
