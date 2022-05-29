import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

// export const getListAccountService = async (page: any, size: any) => {
export const getListScheduleService = async (page: any, size: any) => {
  const response = await request.get(
    // `${HOST}/v1/parties?page=${page}&size=${size}`
    `${HOST}/v1/schedules`
  );
  return response.data;
};

export const createScheduleService = async (data: any) => {
  const response = await request.post(`${HOST}/v1/schedules`, data);
  return response.data;
};