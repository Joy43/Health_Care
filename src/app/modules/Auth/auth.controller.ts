import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { Authservice } from "./auth.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
// --------------login user-------------
const LoginUser=catchAsync(async(req:Request,res:Response)=>{
    const result=await Authservice.LoginUser(req.body);
    const {refreshToken}=result;
    res.cookie('refreshToken',refreshToken,{
        secure:false,
    })
    sendResponse(res,{
        statusCode:status.OK,
        sucess:true,
        message:"login sucessfully",
        data:result
    })
});
// ---------refresh token-----------------

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await Authservice.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: "Access token genereated successfully!",
        data: result
        
    })
});
// ------------------chnage password now-----------------
const changePassword = catchAsync(async (req: Request & {user?:any}, res: Response) => {
const user=req.user;

    const result = await Authservice.changePassword(user,req.body);

    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: "chnage password successfully!",
        data: result
      
    })
});
// -----------------forgot passowrd-----------
const forgotPassword = catchAsync(async (req: Request, res: Response) => {

    await Authservice.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: "Check your email!",
        data: null
    })
});
// ------------reset password--------------
const resetPassword=catchAsync(async (req: Request & {user?:any}, res: Response) => {
const token=req.headers.authorization || "";
    
        const result = await Authservice.resetPassword(token,req.body);
    
        sendResponse(res, {
            statusCode: status.OK,
            sucess: true,
            message: "Reset password successfully!",
            data: result
          
        });
    });
export const AuthController={
    LoginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}