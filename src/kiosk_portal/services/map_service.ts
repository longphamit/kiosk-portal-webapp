import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListProvinceService = async () => {
    const response = await request.get(`${HOST}/v1/provinces`);
    return response.data;
};

export const getListDistrictService = async (cityCode:any) => {
    const response = await request.get(`${HOST}/v1/provinces/districts?cityCode=${cityCode}`);
    return response.data;
};

export const getListWardService = async (districtCode:any) => {
    const response = await request.get(`${HOST}/v1/provinces/wards?districtCode=${districtCode}`);
    return response.data;
};

  