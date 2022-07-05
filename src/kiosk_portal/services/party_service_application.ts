import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const installApplicationService = async (data: any) => {
    const response = await request.post(`${HOST}/v1/my-app`, data);
    return response.data;
  };
