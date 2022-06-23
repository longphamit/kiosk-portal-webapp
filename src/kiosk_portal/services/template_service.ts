import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getListTemplateService = async (page: any, size: any, name: any) => {
    const response = await request.get(
        `${HOST}/v1/templates?Name=${name}&&size=${size}&page=${page}`
    );
    return response.data;
};

export const createTemplateService = async (data: any) => {
    const response = await request.post(`${HOST}/v1/templates`, data);
    return response.data;
};

export const updateTemplateService = async (data: any) => {
    const response = await request.put(`${HOST}/v1/templates`, data);
    return response.data;
};

export const deleteTemplateService = async (id: any) => {
    const response = await request.delete(`${HOST}/v1/templates?templateId=${id}`);
    return response.data;
};

export const createAppCategoryPosition = async (data: any) => {
    const response = await request.post(`${HOST}/v1/catePositions`, data);
    return response.data;
}

export const getTemplateById = async (id: any) => {
    const response = await request.get(
        `${HOST}/v1/templates/id?templateId=${id}`
    );
    return response.data;
}