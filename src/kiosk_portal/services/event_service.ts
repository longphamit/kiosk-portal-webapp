import { HOST } from "../../@app/constants/host";
import { USER_EMAIL } from "../../@app/constants/key";
import { ROLE_ADMIN } from "../../@app/constants/role";
import { localStorageGetReduxState } from "../../@app/services/localstorage_service";
import request from "../../@app/utils/http_client";

export const getListEventService = async (page: any, size: any) => {
    // all events
    if (localStorageGetReduxState().auth.role == ROLE_ADMIN) {
        const response = await request.get(
            `${HOST}/v1/events?size=${size}&pageNum=${page}`
        );
        return response.data;
    }
    return getListLocalEventService(page, size);
};
export const getListLocalEventService = async (page: any, size: any) => {
    // only by creatorId
    const response = await request.get(
        `${HOST}/v1/events?size=${size}&pageNum=${page}&CreatorEmail=${localStorage.getItem(USER_EMAIL)}&Type=local`
    );
    return response.data;
};
export const searchEventService = async (data: any) => {
    const response = await request.get(
        `${HOST}/v1/events?Name=${data.name}&Street=${data.street}&Ward=${data.ward}` +
        `&District=${data.district}&City=${data.city}&CreatorName=${data.creatorName}&CreatorEmail=${data.creatorEmail}` +
        `&Type=${data.type}&Status=${data.status}&size=${data.size}&pageNum=${data.page}`
    );
    return response.data;
}
export const getEventByIdService = async (id: any) => {
    const response = await request.get(
        `${HOST}/v1/events/${id}`
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

export const updateListImageService = async (data: any) => {
    const response = await request.put(`${HOST}/v1/events/replace`, data);
    return response.data;
}

export const updateThumbnailService = async (data: any) => {
    const response = await request.patch(`${HOST}/v1/events/image`, data);
    return response.data
}

export const updateBannerEventService = async (data: any) => {
    const response = await request.patch(`${HOST}/v1/events/banner`, data);
    return response.data
}