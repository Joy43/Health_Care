import status from "http-status";
import { IAuthUser } from "../../interface/authuser";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PrescriptionService } from "./prescription.service";
import { Request, Response } from "express";

const insertIntoDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionService.insertIntoDB(user as IAuthUser, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: 'Prescription created successfully',
        data: result,
    });
});

export const PrescriptionController = {
    insertIntoDB
}