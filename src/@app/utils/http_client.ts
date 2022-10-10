import axios, { AxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HOST } from "../constants/host";
import { ACCESS_TOKEN } from "../constants/key";
const controller = new AbortController();
let cancelAxios = axios.CancelToken.source();
axios.defaults.baseURL = HOST;
axios.defaults.responseType = "json";
axios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "/signin" && err.response) {
      // Access Token was expired
      if (err.response.status === 403) {
        toast.error("You are not allow!");
      }
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        localStorage.removeItem("ACCESS_TOKEN");
        cancelAxios.cancel("----stop all request---");
        toast.error("Your session is expired! Please login again");
        setTimeout(() => {
          localStorage.clear()
          window.location.href = "/signin";
        }, 3000);
        controller.abort();
        // try {
        //   const rs = await axios.post("/auth/refreshtoken", {
        //     refreshToken: localStorage.getItem("REFRESH_TOKEN"),
        //   });
        //   const { token } = rs.data;
        //   localStorage.setItem("TOKEN", token);
        //   return axios(originalConfig);
        // } catch (_error) {
        //   return Promise.reject(_error);
        // }
      }
    }
    return Promise.reject(err);
  }
);
const getAccessToken = () => {
  let accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken == null) {
    return "";
  }
  return accessToken;
};
const createConfig = () => {
  let getConfig: AxiosRequestConfig<any> = {
    headers: {
      "Content-type": "Application/json",
      Authorization: "Bearer " + getAccessToken(),
    },
    cancelToken: cancelAxios.token,
  };
  return getConfig;
};
const customCreateConfig = (payload: any) => {
  let getConfig: AxiosRequestConfig<any> = {
    headers: {
      "Content-type": "Application/json",
      Authorization: "Bearer " + getAccessToken(),
    },
    data: payload
  };
  return getConfig;
};
const multipartConfig = () => {
  let getConfig: AxiosRequestConfig<any> = {
    headers: {
      "Content-type": "multipart/form-data",
      Authorization: "Bearer " + getAccessToken(),
    },
  };
  return getConfig;
};
const request = {
  get: (url: string) => axios.get(url, createConfig()),
  post: (url: string, data: any) => axios.post(url, data, createConfig()),
  put: (url: string, data: any) => axios.put(url, data, createConfig()),
  patch: (url: string, data: any) => axios.patch(url, data, createConfig()),
  delete: (url: string) => axios.delete(url, createConfig()),
  deleteWithPayload: (url: string, payload: any) => axios.delete(url, customCreateConfig(payload)),
  post_multipart: (url: string, data: any) =>
    axios.post(url, data, multipartConfig()),
  patch_multipart: (url: string, data: any) =>
    axios.patch(url, data, multipartConfig()),
};

export default request;
