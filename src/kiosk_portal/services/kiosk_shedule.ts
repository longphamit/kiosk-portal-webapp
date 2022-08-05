import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const createKisokScheduleService = async (data: any) => {
    const response = await request.post(`${HOST}/v1/kioskScheduleTemplates`, data);
    return response.data;
}

export const getKisokScheduleService = async (id: any) => {
    const response = await request.get(
        `${HOST}/v1/kioskScheduleTemplates/kioskId?kioskId=${id}&page=1`
    );
    return response.data;
}

export const deleteKisokScheduleService = async (id: any) => {
    const response = await request.deleteWithPayload(`${HOST}/v1/kioskScheduleTemplates`, { id });
    return response.data;
};

export const updateKisokScheduleService = async (data: any) => {
    const response = await request.put(`${HOST}/v1/kioskScheduleTemplates`, data);
    return response.data;
};

export const updateKioskScheduleStatuService = async (id: any) => {
    const response = await request.patch(`${HOST}/v1/kioskScheduleTemplates/status?kioskScheduleTemplateId=${id}`, null);
    return response.data;
}