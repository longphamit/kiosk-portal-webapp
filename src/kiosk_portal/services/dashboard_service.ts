import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const countKioskService = async () => {
    const response = await request.get(`${HOST}/v1/dashboard/count/kiosk`);
    return response.data
}
export const countPoiService = async () => {
    const response = await request.get(`${HOST}/v1/dashboard/count/poi`);
    return response.data
}
export const countEventService = async () => {
    const response = await request.get(`${HOST}/v1/dashboard/count/event`);
    return response.data
}
export const countAppService = async () => {
    const response = await request.get(`${HOST}/v1/dashboard/count/app`);
    return response.data
}