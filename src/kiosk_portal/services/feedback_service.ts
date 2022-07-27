import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getFeedbacksService = async (id: string) => {
    const response = await request.get(
        `${HOST}/v1/feedbacks?appId=${id}`
    );
    return response.data;
};

export const createFeedbackService = async (data: any) => {
    const response = await request.post(`${HOST}/v1/feedbacks`, data);
    return response.data;
};

export const updateFeedbackService = async (data: any) => {
    const response = await request.put(`${HOST}/v1/feedbacks`, data);
    return response.data;
};