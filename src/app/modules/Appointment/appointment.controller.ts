import { IAuthUser } from "../../interface/authuser";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import status from "http-status";

const createAppointment=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{

const user=req.user;
const result=await AppointmentService.createAppointment(user as IAuthUser,req.body)
res.status(200).json({
    status:status.CREATED,
    message:"appointment created successfully",
    data:result
});
});

export const AppointmentController = {
    createAppointment
};