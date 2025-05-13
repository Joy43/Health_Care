import { IAuthUser } from "../../interface/authuser";
import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import status from "http-status";
import pick from "../../shared/pick";
import sendResponse from "../../shared/sendResponse";
import { appointmentFilterableFields } from "./appoinment.constant";

const createAppointment=catchAsync(async(req:Request & {user?:IAuthUser},res:Response)=>{

const user=req.user;
const result=await AppointmentService.createAppointment(user as IAuthUser,req.body)
res.status(200).json({
    status:status.CREATED,
    message:"appointment created successfully",
    data:result
})
});
// --------------get appointment------------------
const getMyAppointment = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, ['status', 'paymentStatus']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await AppointmentService.getMyAppointment(user as IAuthUser, filters, options);

    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: 'My Appointment retrive successfully',
        data: result
    });
});

// --------------get appointment by id------------------
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, appointmentFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await AppointmentService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: 'Appointment retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});
// --------------update appointment status------------------

const changeAppointmentStatus = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const result = await AppointmentService.changeAppointmentStatus(id, status, user as IAuthUser);
    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: 'Appointment status changed successfully',
        data: result
    });
});

export const AppointmentController = {
    createAppointment,
    getMyAppointment ,
    getAllFromDB,
    changeAppointmentStatus
};