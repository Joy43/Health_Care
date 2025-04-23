import { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";



// -----------create admin----------------
const createAdmin=catchAsync(async (req: Request, res: Response)=>{
    console.log('file info',req)
 
const result = await userService.createAdmin(req);
sendResponse(res, {
    statusCode: status.OK,
    sucess: true,
    message: "Admin Created successfully!",
    data: result,
})
});
export const userController={
    createAdmin
}