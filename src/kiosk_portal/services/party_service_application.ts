import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const installApplicationService = async (data: any) => {
    const response = await request.post(`${HOST}/v1/my-app`, data);
    return response.data;
  };

export const getListMyAppService = async (ServiceApplicationName:any,size:any,page:any) => {
    const response = await request.get(`${HOST}/v1/my-app?ServiceApplicationName=${ServiceApplicationName}&size=${size}&page=${page}`);
    return response.data;
};