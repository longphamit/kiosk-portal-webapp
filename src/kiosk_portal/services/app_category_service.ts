import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListAppCategoryService = async (page: any, size: any) => {
  const response = await request.get(
    `${HOST}/v1/categories?page=${page}&size=${size}`
  );
  return response.data;
};

export const updateAppCategoryService = async (data: any) => {
  const response = await request.put(`${HOST}/v1/categories`, data);
  return response.data;
};

export const deleteAppCategoryService = async (id: any) => {
  const response = await request.deleteWithPayload(`${HOST}/v1/categories`, { id });
  return response.data;
};