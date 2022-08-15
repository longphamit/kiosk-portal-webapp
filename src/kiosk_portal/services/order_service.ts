import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getKisokOrderCommissionService = async (kioskId: any, serviceApplicationId: any) => {
    let extraQuery = serviceApplicationId.length !== 0 ? `&ServiceApplicationId=${serviceApplicationId}` : ''
    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission/kiosk?kioskId=${kioskId}${extraQuery}`
    );
    return response.data;
}
export const getKisokOrderCommissionByAppIdService = async (kioskId: any, serviceApplicationId: any) => {
    let extraQuery = serviceApplicationId.length !== 0 ? `&ServiceApplicationId=${serviceApplicationId}` : ''
    const response = await request.get(
        `${HOST}/v1/serviceOrders?KioskId=${kioskId}${extraQuery}&page=1`
    );
    return response.data;
}

export const getKisokOrderCommissionByYearService = async (year: any, kioskId: any) => {

    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission/kiosk/year?kioskId=${kioskId}&year=${year}`
    );
    return response.data;
}

export const getKisokOrderCommissionByMonthService = async (month: any, year: any, kioskId: any) => {
    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission/kiosk/month?kioskId=${kioskId}&month=${month}&year=${year}`
    );
    return response.data;
}

export const getKisokOrderCommissionByYearAndAppsService = async (year: any, kioskId: any, appIds: any) => {
    let appsQuery = '';
    appIds.map((e: any) => {
        appsQuery += `&serviceApplicationIds=${e}`
    })
    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission/kiosk/monthOfYear?kioskId=${kioskId}&year=${year}` + getAppsQuery(appIds)
    );
    return response.data;
}

export const getKisokOrderCommissionByMonthAndAppsService = async (month: any, year: any, kioskId: any, appIds: any) => {

    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission/kiosk/dayOfMonth?kioskId=${kioskId}&month=${month}&year=${year}` + getAppsQuery(appIds)
    );
    return response.data;
}

const getAppsQuery = (appIds: any) => {
    if (appIds.length === 0) return '';
    let appsQuery = '';
    appIds.map((e: any) => {
        appsQuery += `&serviceApplicationIds=${e}`
    })
    return appsQuery
}
const getKiosksQuery = (kioskIds: any) => {
    if (kioskIds.length === 0) return '';
    let kiosksQuery = '';
    kioskIds.map((e: any) => {
        kiosksQuery += `&kioskIds=${e}`
    })
    return kiosksQuery
}
export const getAppOrderCommissionService = async (appId: any, page: any, size: any) => {
    const response = await request.get(
        `${HOST}/v1/serviceOrders/${appId}?size=${size}&page=${page}`
    );
    return response.data;
}

export const getKioskCommissionsByYearService = async (year: any, kioskIds: any) => {
    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission/monthOfYear?year=${year}` + getKiosksQuery(kioskIds)
    );
    return response.data;
}

export const getKioskCommissionsByMonthService = async (month: any, year: any, kioskIds: any) => {
    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission/dayOfMonth?month=${month}&year=${year}` + getKiosksQuery(kioskIds)
    );
    return response.data;
}

export const getSystemCommissionByYearService = async (year: any) => {
    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission/system/year?year=${year}`
    );
    return response.data;
}

export const getSystemCommissionByMonthService = async (month: any, year: any) => {
    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission/system/month?month=${month}&year=${year}`
    );
    return response.data;
}

export const getSystemCommissionByYearAndServiceApplicationIdsServices = async (year: any, appIds: any) => {
    let appsQuery = getAppsQuery(appIds);
    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission/system/monthOfYear?year=${year}` + appsQuery
    );
    return response.data;
}
export const getSystemCommissionByMonthAndServiceApplicationIdsServices = async (month: any, year: any, appIds: any) => {
    let appsQuery = getAppsQuery(appIds);
    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission/system/dayOfMonth?month=${month}&year=${year}` + appsQuery
    );
    return response.data;
}