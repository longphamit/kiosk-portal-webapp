import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getAccountByIdService = async (id:string) => {
  const response = await request.get(
    `${HOST}/v1/parties/${id}`
  );
  return response.data;
};
