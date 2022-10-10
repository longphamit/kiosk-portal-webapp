import { customSort } from "../../../@app/utils/sort";
import { getListDistrictService, getListWardService } from "../../services/location_services";
import { getListProvinceService } from "../../services/map_service";

export const getDistricts = async (selectedCity) => {
    try {
        let res = await getListDistrictService(selectedCity);
        return customSort(res.data);
    } catch (err) {
        console.error(err);
    }
}
export const getWards = async (selectedDistrict) => {
    try {
        let res = await getListWardService(selectedDistrict);
        return customSort(res.data);
    } catch (err) {
        console.error(err);
    }
}
export const getCities = async () => {
    try {
        const resProvinces = await getListProvinceService();
        return customSort(resProvinces.data);
    } catch (error) {
        console.error(error)
    }
};