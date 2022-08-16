import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListPoiCategoriesService = async (Name:any,size:any,page:any) => {
    const response = await request.get(`${HOST}/v1/poiCategories?Name=${Name}&size=${size}&page=${page}`);
    return response.data;
};

export const createPoiCategoriesService = async (data: any) => {
    const response = await request.post(`${HOST}/v1/poiCategories`, data);
    return response.data;
};

export const updatePoiCategoryService = async (data: any) => {
    const response = await request.put(`${HOST}/v1/poiCategories`, data);
    return response.data;
  };

  export const deletePoiCategoryService = async (id: any) => {
    const response = await request.delete(`${HOST}/v1/poiCategories?poiCategoryId=${id}`);
    return response.data;
};