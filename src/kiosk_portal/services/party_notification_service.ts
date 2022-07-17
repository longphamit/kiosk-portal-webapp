import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getPartyNotificationService = async (size:any,page:any) => {
    const response = await request.get(`${HOST}/v1/partyNotifications?size=${size}&page=${page}`);
    return response.data;
};

export const updateStatusNotificationService = async (data:any) =>{
    const response = await request.patch(`${HOST}/v1/partyNotifications`, data);
    return response.data
}