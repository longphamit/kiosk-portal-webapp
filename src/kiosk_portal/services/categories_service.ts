import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListCategoriesService = async (Name:any,size:any,page:any) => {
    const response = await request.get(`${HOST}/v1/categories?Name=${Name}&size=${size}&page=${page}`);
    return response.data.data;
};