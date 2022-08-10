import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListPoiService = async (Name:any,Ward:any,District:any,City:any,Address:any,PoicategoryId:any,Type:any,size:any,pageNum:any) => {
    const response = await request.get(
        `${HOST}/v1/pois?Name=${Name}&Ward=${Ward}&District=${District}&City=${City}&Address=${Address}&PoicategoryId=${PoicategoryId}&Type=${Type}&size=${size}&pageNum=${pageNum}`);
    return response.data;
  };
  
export const createPoiService = async (data: any) => {
    const response = await request.post(`${HOST}/v1/pois`, data);
    return response.data;
};

export const getPoiByIdService = async (id:any) => {
  const response = await request.get(
      `${HOST}/v1/pois/${id}`);
  return response.data;
};

export const updatePoiBasicService = async (data: any) => {
  const response = await request.put(`${HOST}/v1/pois`, data);
  return response.data;
};

export const updatePoiListImgService = async (data: any) => {
  const response = await request.put(`${HOST}/v1/pois/replace`, data);
  return response.data;
};

export const changeStatusPoiService = async (data: any) => {
  const response = await request.patch(`${HOST}/v1/pois/status`, data);
  return response.data
}

export const updateBannerPoiService = async (data: any) => {
  const response = await request.patch(`${HOST}/v1/pois/banner`, data);
  return response.data
}