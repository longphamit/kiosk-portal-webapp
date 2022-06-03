import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListAppPublishRequestService = async (page: any, size: any) => {
  const response = await request.get(
    `${HOST}/v1/publishRequests?page=${page}&size=${size}`
  );
  return response.data;
};
export const getListAppPublishRequestSearchService = async (
  page: any,
  size: any,
  data: any
) => {
  const response = await request.get(`${HOST}/v1/publishRequests?
page=${page}
&size=${size}
&CreatorEmail=${data.CreatorEmail ?? ""}
&ServiceApplicationName=${data.ServiceApplicationName ?? ""}
&HandlerName=${data.HandlerName ?? ""}
&Status=${data.status}`);
  return response.data;
};
