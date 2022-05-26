import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListKioskLocationService = async (partyId:string,page: any, size: any) => {
    const response = await request.get(
      `${HOST}/v1/kioskLocations?partyId=${partyId}&page=${page}&size=${size}`
    );
    return response.data;
  };