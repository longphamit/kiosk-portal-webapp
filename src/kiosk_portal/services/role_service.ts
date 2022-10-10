import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListRoleService = async () => {
    const response = await request.get(`${HOST}/v1/roles`);
    return response.data;
  };
  