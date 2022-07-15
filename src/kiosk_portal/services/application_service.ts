import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListApplicationService = async (Name:any,PartyName:any,PartyEmail:any,AppCategoryId:any,AppCategoryName:any,Status:any, size: any,page: any) => {
  const response = await request.get(
    `${HOST}/v1/serviceApplications?Name=${Name}&PartyName=${PartyName}&PartyEmail=${PartyEmail}&AppCategoryId=${AppCategoryId}&AppCategoryName=${AppCategoryName}&Status=${Status}&size=${size}&page=${page}`
  );
  return response.data;
};
export const getListApplicationServiceByCategory = async (categoryName: any) => {
  const response = await request.get(
    `${HOST}/v1/serviceApplications?page=1&AppCategoryName=${categoryName}&status=installed`
  );
  return response.data;
};
export const getApplicationServiceById = async (id:string) => {
  const response = await request.get(
    `${HOST}/v1/serviceApplications/${id}`
  );
  return response.data;
};

export const createApplicationService = async (data: any) => {
  const response = await request.post(`${HOST}/v1/serviceApplications`, data);
  return response.data;
};

export const sendReqPublishApplicationService = async (data: any) => {
  const response = await request.post(`${HOST}/v1/publishRequests`, data);
  return response.data;
};

export const updateApplicationService = async (data: any) => {
  const response = await request.put(`${HOST}/v1/serviceApplications`, data);
  return response.data;
};
