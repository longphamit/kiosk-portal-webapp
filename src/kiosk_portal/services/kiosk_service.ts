import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListKioskService = async (
  partyId: string,
  page: any,
  size: any
) => {
  const response = await request.get(
    `${HOST}/v1/kiosks?partyId=${partyId}&page=${page}&size=${size}`
  );
  return response.data;
};
export const createKioskService = async (data: any) => {
  const response = await request.post(`${HOST}/v1/kiosks`, data);
  return response.data;
};
export const changeStatusKioskService = async (id: string) => {
  const response = await request.patch(`${HOST}/v1/kiosks/status?id=${id}`, null);
  return response.data;
};

export const updateKioskService = async (data: any) => {
  const response = await request.put(`${HOST}/v1/kiosks`, data);
  return response.data;
};

export const getKioskByIdService = async (id: any) => {
  const response = await request.get(`${HOST}/v1/kiosks/${id}`);
  return response.data;
};

export const changeNameKioskService = async (id:any,data:any) => {
  const response = await request.patch(`${HOST}/v1/kiosks/name?id=${id}`, data);
  return response.data;
};