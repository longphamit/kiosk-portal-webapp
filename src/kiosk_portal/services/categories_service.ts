import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListCategoriesService = async (Name:any,size:any,page:any) => {
    const response = await request.get(`${HOST}/v1/categories?Name=${Name}&size=${size}&page=${page}`);
    return response.data.data;
};
export const getAllCategoriesService = async () => {
    const response = await request.get(`${HOST}/v1/categories?size=-1&page=1`);
    return response.data.data;
};
export const getListAvailableCategoriesService = async () => {
    const response = await request.get(`${HOST}/v1/categories?page=1`);
    return response.data.data;
};

export const createCategoriesService = async (data: any) => {
    const response = await request.post(`${HOST}/v1/categories`, data);
    return response.data;
  };

export const getListAvailableEventsService= async () => {
    const response = await request.get(`${HOST}/v1/events?pageNum=1`);
    return response.data.data;
};