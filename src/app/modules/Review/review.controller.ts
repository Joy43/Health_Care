import { Request, Response } from "express";

import httpStatus from "http-status";

import { reviewFilterableFields } from "./review.contant";
import catchAsync from "../../shared/catchAsync";
import { IAuthUser } from "../../interface/authuser";
import { ReviewService } from "./review.service";
import sendResponse from "../../shared/sendResponse";

const insertIntoDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.insertIntoDB(user as IAuthUser, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        sucess: true,
        message: 'Review created successfully',
        data: result,
    });
});



export const ReviewController = {
    insertIntoDB,
    
}