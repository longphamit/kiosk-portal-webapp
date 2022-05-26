import { HOST } from "../constants/host";
import request from "../utils/http_client";

export const getAllUserService = async () => {
  const response = await request.get(`${HOST}/user`);
  return response.data;
};
export const getAllUserToAddGroupService = async (groupId: string) => {
  const response = await request.get(`${HOST}/user/group/${groupId}`);
  return response.data;
};
export const getUserInfoService = async () => {
  const response = await request.get(`${HOST}/user/info`);
  return response.data;
};
export const updateUserInfoService = async (userId: string, userInfo: any) => {
  const response = await request.patch(`${HOST}/user/${userId}`, userInfo);
  return response.data;
};
export const getUserInfoByUserIdService = async (userId: string) => {
  const response = await request.get(`${HOST}/user/info/${userId}`);
  return response.data;
};
export const searchUserToAddGroupService = async (
  userName: string,
  groupId: string
) => {
  const response = await request.get(
    `${HOST}/user/search/${groupId}?s=${userName}`
  );
  return response.data;
};

//Account
export const changePasswordService = async (data: any) => {
  const response = await request.patch(`${HOST}/user/change-password`, data);
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
    `${HOST}/v1/parties?FirstName=${data.firstName}&LastName=${data.lastName}&PhoneNumber=${data.phoneNumber}&Email=${data.email}&Address=${data.email}&size=${data.size}&page=${data.page}`
  );
  return response.data;
};

export const updateAccountService = async (data: any) => {
  const response = await request.put(`${HOST}/v1/parties`, data);
  return response.data;
};

//Role
export const getListRoleService = async () => {
  const response = await request.get(`${HOST}/v1/roles`);
  return response.data;
};


//Schedule

// export const getListAccountService = async (page: any, size: any) => {
export const getListScheduleService = async (page: any, size: any) => {
  const response = await request.get(
    // `${HOST}/v1/parties?page=${page}&size=${size}`
    `${HOST}/v1/schedules`
  );
  return response.data;
};

export const createScheduleService = async (data: any) => {
  const response = await request.post(`${HOST}/v1/schedules`, data);
  return response.data;
};