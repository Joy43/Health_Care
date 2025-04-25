import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import status from "http-status";
import sendResponse from "../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";

const insetIntoDB = catchAsync(async (req: Request, res: Response) => {
 
const result =await SpecialtiesService.insertIntoDB(req)
   

    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: "specialties created successfully!",
        data: result
        
    })
});
// -----get data----------

const GetSpecialtie=catchAsync(async(req: Request, res: Response) => {
    const result = await SpecialtiesService.GetSpecialties();
    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: "Get specialties successfully",
        data: result
    });

});
// -----------delete data---------
const DeleteSpecialties=catchAsync(async(req: Request, res: Response) => {
    const {id}=req.params;
    const result = await SpecialtiesService.DeleteSpecialties(id);
    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: "specialties Delete successfully",
        data: result
    });

});

export const specialtiesController={
    insetIntoDB,
    GetSpecialtie,
    DeleteSpecialties
}