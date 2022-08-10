import { HOST } from "../../@app/constants/host";
import request from "../../@app/utils/http_client";

export const getKisokOrderCommissionService = async (kioskId: any) => {
    const response = await request.get(
        `${HOST}/v1/serviceOrders/commission?kioskId=${kioskId}`
    );
    return response.data;
}
