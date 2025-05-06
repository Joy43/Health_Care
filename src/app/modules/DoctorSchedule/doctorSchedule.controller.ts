import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IAuthUser } from "../../interface/authuser";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";

const  insertIntoDB=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{

    const user=req.user;
    const result=await DoctorScheduleService.insertIntoDB(user,req.body);
    sendResponse(res,{
        statusCode:status.OK,
        sucess:true,
        message:"doctor schedule created sucecssfully",
        data:result
    })
})

export const DoctorScheduleController = {
    insertIntoDB,
  
};