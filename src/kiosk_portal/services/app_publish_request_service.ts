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
export const getInprogressAppPublishRequestByAppIdService = async (
  appId: string
) => {
  const response = await request.get(
    `${HOST}/v1/publishRequests/inprogress/appId/${appId}`
  );
  return response.data;
};
export const approveAppPublishRequestService = async (requestId: string) => {
  const response = await request.put(`${HOST}/v1/publishRequests`, {
    id: requestId,
    status: "approved",
  });
  return response.data;
};
export const denyAppPublishRequestService = async (requestId: string,comment:string) => {
  const response = await request.put(`${HOST}/v1/publishRequests`, {
    id: requestId,
    status: "denied",
    handlerComment:comment
  });
  return response.data;
};



export const cancelPublishRequestService = async (data:any) =>{
  const response = await request.patch(`${HOST}/v1/publishRequests/status`, data);
  return response.data
}