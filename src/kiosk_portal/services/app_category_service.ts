import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListAppCategoryService = async (page: any, size: any) => {
  const response = await request.get(
    `${HOST}/v1/categories?page=${page}&size=${size}`
  );
  return response.data;
};
