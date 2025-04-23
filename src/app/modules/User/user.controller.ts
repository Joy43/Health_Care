import { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { userFilterableFields } from "./user.constant";

// -----------create admin----------------
const createAdmin=catchAsync(async (req: Request, res: Response)=>{
    console.log('file info',req)
 
const result = await userService.createAdmin(req);
sendResponse(res, {
    statusCode: status.OK,
    sucess: true,
    message: "Admin Created successfully!",
    data: result,
})
});
// -----------------create doctor------------
const createDoctor=catchAsync(async (req: Request, res: Response)=>{
    console.log('file info',req)
 
const result = await userService.createDoctor(req);
sendResponse(res, {
    statusCode: status.OK,
    sucess: true,
    message: "DOCTOR Created successfully!",
    data: result,
})
});
// ---------------create patient----------
const createPatient=catchAsync(async (req: Request, res: Response)=>{
    console.log('file info',req)
 
const result = await userService.createPatient(req);
sendResponse(res, {
    statusCode: status.OK,
    sucess: true,
    message: "Patient Created successfully!",
    data: result,
})
});
// ----------get all users---------------

const getAllFromDB=catchAsync(
    async(req:Request,res:Response)=>{
 
        const filters=  pick(req.query,userFilterableFields);
        const options=pick(req.query,['limit','page','sortBy','sortOrder'])
        console.log(options)
          const result=await  userService.getAllFromDB(filters,options);
      console.log(options);
   
      res.status(200).json({
          message:"Users data fetched",
          meta:result.meta,
          data:result.data
      });
      }

)

export const userController={
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB
}