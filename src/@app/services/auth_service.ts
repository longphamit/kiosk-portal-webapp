import { HOST } from "../constants/host";
import request from "../utils/http_client";

export const signInService=async(email:string,password:string)=>{
   const response= await request.post(`${HOST}/v1/auth`,{
        email,
        password
    })
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
    const response=await request.post(`${HOST}/user/forgot-password`,email);
    return response.data;
};