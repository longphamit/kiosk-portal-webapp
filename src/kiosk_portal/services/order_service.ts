import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getKisokOrderCommissionService = async (kioskId: any, serviceApplicationId: any) => {
    let extraQuery = serviceApplicationId.length !== 0 ? `&ServiceApplicationId=${serviceApplicationId}` : ''
    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission?kioskId=${kioskId}${extraQuery}`
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
    let appsQuery = '';
    appIds.map((e: any) => {
        appsQuery += `&serviceApplicationIds=${e}`
    })
    return appsQuery
}