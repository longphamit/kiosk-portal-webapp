import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListPoiCategoriesService = async (Name:any,size:any,page:any) => {
    const response = await request.get(`${HOST}/v1/poiCategories?Name=${Name}&size=${size}&page=${page}`);
    return response.data;
};