import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListScheduleService = async (page: any, size: any) => {
  const response = await request.get(`${HOST}/v1/schedules?pageNum=${page}&size=${size}`);
  return response.data;
};

export const getListScheduleWithoutParamService = async () => {
  const response = await request.get(`${HOST}/v1/schedules?pageNum=1`);
  return response.data;
};
//schedules/id?scheduleId=0c2be3f8-bf85-40e1-9dae-5c77ed143571
export const getScheduleByIdService = async (id: any) => {
  const response = await request.get(`${HOST}/v1/schedules/id?scheduleId=${id}`);
  return response.data;
};


export const createScheduleService = async (data: any) => {
  const response = await request.post(`${HOST}/v1/schedules`, data);
  return response.data;
};


export const updateScheduleService = async (data: any) => {
  const response = await request.put(`${HOST}/v1/schedules`, data);
  return response.data;
};
export const changeScheduleStatusService = async (scheduleId:any) => {
  const response = await request.patch(`${HOST}/v1/schedules/status?scheduleId=${scheduleId}`,{});
  return response.data;
};