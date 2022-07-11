import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListScheduleService = async (page: any, size: any) => {
  const response = await request.get(`${HOST}/v1/schedules?pageNum=${page}&size=${size}`);
  return response.data;
};

export const createScheduleService = async (data: any) => {
  const response = await request.post(`${HOST}/v1/schedules`, data);
  return response.data;
};

export const updateScheduleService= async (data: any) => {
  const response = await request.put(`${HOST}/v1/schedules`, data);
  return response.data;
};