import request from "../../@app/utils/http_client";
import { HOST } from "../../@app/constants/host";

export const getListProviceService = async () => {
    const response = await request.get(
        `${HOST}/v1/provinces`
    );
    return response.data;
};

export const getListDistrictService = async (id: string) => {
    const response = await request.get(
        `${HOST}/v1/provinces/districts?cityCode=${id}`
    );
    return response.data;
};
export const getListWardService = async (id: string) => {
    const response = await request.get(
        `${HOST}/v1/provinces/wards?districtCode=${id}`
    );
    return response.data;
};

export const getGeographicCoordinate = async (address: string) => {
    const response = await request.get(
        `${HOST}/v1/map/geocode/forward/address/${address}`
    );
    return response.data;
}