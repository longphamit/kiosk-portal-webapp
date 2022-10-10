import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const installApplicationService = async (data: any) => {
  const response = await request.post(`${HOST}/v1/my-app`, data);
  return response.data;
};

export const getListMyAppService = async (ServiceApplicationName: any, status: any, size: any, page: any) => {
  const response = await request.get(`${HOST}/v1/my-app?ServiceApplicationName=${ServiceApplicationName}&size=${size}&page=${page}&status=${status}`);
  return response.data;
};
export const getListInstallAppService = async () => {
  const response = await request.get(`${HOST}/v1/my-app?&page=1&status=installed`);
  return response.data;
};
export const getAllMyApplicationService = async () => {
  const response = await request.get(`${HOST}/v1/my-app?&page=1`);
  return response.data;
};
export const changeStatusMyAppService = async (serviceApplication: any) => {
  const response = await request.patch(`${HOST}/v1/my-app/status`, {
    "serviceApplication": serviceApplication
  });
  return response.data;
};

export const getApplicationsByCategoryIdService = async (categoryId: any) => {
  const response = await request.get(
    `${HOST}/v1/my-app?AppCategoryId=${categoryId}&Status=installed&page=1`
  );
  return response.data;
};

export const getMyApplicationById = async (id: any) => {
  const response = await request.get(
    `${HOST}/v1/my-app?ServiceApplicationId=${id}&Status=installed&page=1`
  );
  return response.data;
}