import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const addTemplateToScheduleService = async (data: any) => {
    const response = await request.post(`${HOST}/v1/scheduleTemplate`, data);
    return response.data;
};