import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import { scheduleService } from "./schedule.service";

const inserIntoDB=catchAsync(async(req:Request,res:Response)=>{
const result=await scheduleService.inserIntoDB(req.body)

    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: 'schedule successfully',
        data: result,
      })
});

export const ScheduleController={
    inserIntoDB
}