
import { HOST } from "../constants/host";
import request from "../utils/http_client";


export const getAllUserService=async()=>{
    const response=await request.get(`${HOST}/user`);
    return response.data;
};
export const getAllUserToAddGroupService = async (groupId: string) => {
    const response = await request.get(`${HOST}/user/group/${groupId}`);
    return response.data;
};
export const getUserInfoService = async () => {
    const response = await request.get(`${HOST}/user/info`);
    return response.data;
};
export const updateUserInfoService = async (userId:string,userInfo:any) => {
    const response = await request.patch(`${HOST}/user/${userId}`,userInfo);
    return response.data;
};
export const getUserInfoByUserIdService = async (userId:string) => {
    const response = await request.get(`${HOST}/user/info/${userId}`);
    return response.data;
};
export const searchUserToAddGroupService = async (userName:string,groupId:string) => {
    const response = await request.get(`${HOST}/user/search/${groupId}?s=${userName}`);
    return response.data;
};
export const changePasswordService = async (data:any) => {
    const response = await request.patch(`${HOST}/user/change-password`,data);
    return response.data;
}
export const resetPasswordService = async (email:string,uuid:string,password:any) => {
    const response = await request.patch(`${HOST}/user/reset-password?email=${email}&uuid=${uuid}`,password);
    return response.data;
}
export const activeAccountService = async (userId:string,uuid:string,password:any) => {
    const response = await request.get(`${HOST}/user/active?id=${userId}&uuid=${uuid}`);
    return response.data;
}