import { Request, Response } from "express";

import httpStatus from "http-status";
import { DoctorScheduleService } from "./doctorSchedule.service";

import { scheduleFilterableFields } from "./doctorSchedule.constants";
import catchAsync from "../../shared/catchAsync";
import { IAuthUser } from "../../interface/authuser";
import sendResponse from "../../shared/sendResponse";
import pick from "../../shared/pick";

const insertIntoDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user;
    const result = await DoctorScheduleService.insertIntoDB(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        sucess: true,
        message: "Doctor Schedule created successfully!",
        data: result
    });
});

const getMySchedule = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await DoctorScheduleService.getMySchedule(filters, options, user as IAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        sucess: true,
        message: "My Schedule fetched successfully!",
        data: result
    });
});

const deleteFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user;
    const { id } = req.params;
    const result = await DoctorScheduleService.deleteFromDB(user as IAuthUser, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        sucess: true,
        message: "My Schedule deleted successfully!",
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, scheduleFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await DoctorScheduleService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        sucess: true,
        message: 'Doctor Schedule retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const DoctorScheduleController = {
    insertIntoDB,
    getMySchedule,
    deleteFromDB,
    getAllFromDB
};