import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import pick from "../../shared/pick";
import { ScheduleService } from "./schedule.service";
import { IAuthUser } from "../../interface/authuser";


const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.inserIntoDB(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: "Schedule created successfully!",
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await ScheduleService.getAllFromDB(filters, options, user as IAuthUser);

    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: "Schedule fetched successfully!",
        data: result
    });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ScheduleService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: 'Schedule retrieval successfully',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ScheduleService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: 'Schedule deleted successfully',
        data: result,
    });
});


export const ScheduleController = {
    inserIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB
};