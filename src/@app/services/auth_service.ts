import { HOST } from "../constants/host";
import request from "../utils/http_client";

export const signInService=async(email:string,password:string,deviceId:any)=>{
   const response= await request.post(`${HOST}/v1/auth`,{
        email,
        password,
        deviceId
    })
    return response.data
};
export const signOutService=async()=>{
    const response= await request.post(`${HOST}/v1/auth/logout`,{})
     return response.data
 };
export const signUpService=async(firstName:string,lastName:string,gender:string,dob:Date,username:string,phone:string,email:string,cardNumber:string,password:string)=>{
    const response=await request.post(`${HOST}/user/sign-up`,{
        firstName,
        lastName,
        gender,
        dob,
        phone,
        username,
        email,
        cardNumber,
        password});
    return response.data;
};
export const forgotPasswordService=async(email:string)=>{
    const response=await request.get(`${HOST}/v1/parties/forgetPassword?email=${email}`);
    return response.data;
};

export const resetPasswordService=async(partyId:string,verifyCode:string)=>{
    const response=await request.get(`${HOST}/v1/parties/resetPassword?partyId=${partyId}&verifyCode=${verifyCode}`);
    return response.data;
};