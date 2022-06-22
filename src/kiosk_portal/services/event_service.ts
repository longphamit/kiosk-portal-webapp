import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListEventService = async (page: any, size: any, name: any, type: any, status: any, creatorId: any) => {
    const response = await request.get(
        `${HOST}/v1/events?Name=${name}&Type=${type}&Status=${status}&size=${size}&pageNum=${page}&CreatorId=${creatorId}`
    );
    return response.data;
};

export const createEventService = async (data: any) => {
    const response = await request.post(`${HOST}/v1/events`, data);
    return response.data;
};

export const updateEventService = async (data: any) => {
    const response = await request.put(`${HOST}/v1/events`, data);
    return response.data;
};

export const deleteEventService = async (id: any) => {
    const response = await request.delete(`${HOST}/v1/events?eventId=${id}`);
    return response.data;
};
