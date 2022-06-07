import { getListCategoriesService } from "../../kiosk_portal/services/categories_service";
import { getListRoleService } from "../../kiosk_portal/services/role_service";

export const getListRoleFunction = async () => {
    try {
      const res= await getListRoleService();
      return res.data;
    } catch (error) {
      console.log(error);
    }
};

export const getListCategoriesFunction = async (Name:any,size:any,page:any) => {
    try {
      const res = await getListCategoriesService(Name,size,page);
      return res.data;
    } catch (error) {
      console.log(error);
    }
};