import { Request, Response } from "express";
import { IAuthUser } from "../../interface/authuser";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
const user=req.params;
    const result = await (req.user);
    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: 'Review created successfully',
        data: result,
    })
});

export const ReviewController = {insertIntoDB}