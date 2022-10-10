import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getAccountByIdService = async (id:string) => {
  const response = await request.get(
    `${HOST}/v1/parties/${id}`
  );
  return response.data;
};

export const resetPasswordService = async (data: any) => {
  const response = await request.patch(`${HOST}/v1/parties/password`, data);
  return response.data;
};
export const activeAccountService = async (
  userId: string,
  uuid: string,
  password: any
) => {
  const response = await request.get(
    `${HOST}/user/active?id=${userId}&uuid=${uuid}`
  );
  return response.data;
};

export const getListAccountService = async (page: any, size: any) => {
  const response = await request.get(
    `${HOST}/v1/parties?page=${page}&size=${size}`
  );
  return response.data;
};

export const createAccountService = async (data: any) => {
  const response = await request.post(`${HOST}/v1/parties`, data);
  return response.data;
};

export const changeStatusAccountService = async (id: any, data: any) => {
  const response = await request.patch(
    `${HOST}/v1/parties/status?id=${id}`,
    data
  );
  return response.data;
};

export const searchAccountService = async (data: any) => {
  const response = await request.get(
    `${HOST}/v1/parties?FirstName=${data.firstName}&LastName=${data.lastName}&PhoneNumber=${data.phoneNumber}&Email=${data.email}&Address=${data.address}&Status=${data.status}&RoleName=${data.roleName}&size=${data.size}&page=${data.page}`
  );
  return response.data;
};

export const updateAccountService = async (data: any) => {
  const response = await request.put(`${HOST}/v1/parties`, data);
  return response.data;
};