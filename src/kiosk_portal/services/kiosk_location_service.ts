import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListKioskLocationService = async (Name:string,page: any, size: any) => {
    const response = await request.get(
      `${HOST}/v1/kioskLocations?Name=${Name}&page=${page}&size=${size}`
    );
    return response.data;
  };
  
  export const getLocationByIdService = async (id:any) => {
    const response = await request.get(`${HOST}/v1/kioskLocations/id?id=${id}`);
    return response.data;
  };

  export const updateLocationBasicService = async (data: any) => {
    const response = await request.put(`${HOST}/v1/kioskLocations`, data);
    return response.data;
  };
  
  export const updateLocationListImgService = async (data: any) => {
    const response = await request.put(`${HOST}/v1/kioskLocations/replace`, data);
    return response.data;
  };

  export const createLocationService = async (data: any) => {
    const response = await request.post(`${HOST}/v1/kioskLocations`, data);
    return response.data;
};