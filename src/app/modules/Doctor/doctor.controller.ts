import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { Request, Response } from "express";
import { DoctorService } from "./doctor.service";
import pick from "../../shared/pick";
import { doctorFilterableFields } from "./doctor.constant";


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await DoctorService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: 'Doctors retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});
// -------------------uodate-------------------
// const updateIntoDB = catchAsync(async (req: Request, res: Response) => {

//     const { id } = req.params;
//     const result = await DoctorService.updateIntoDB(id, req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Doctor data updated!",
//         data: result
//     })
// });

export const DoctorController={
   getAllFromDB,
}