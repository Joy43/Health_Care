import { Request, Response } from "express";

// Extend the Request interface to include the 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { IAuthUser } from "../../interface/authuser";

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

);
// -------------change status user-------------
const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await userService.changeProfileStatus(id, req.body)

    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: "Users profile status changed!",
        data: result
    })
});

// ---------get myprofile------------
const getMyProfile=catchAsync(async(req:Request,res:Response)=>{
    const user=req.user;
    const result=await userService.getMyProfile(user as IAuthUser)
    sendResponse(res,{
        statusCode:status.OK,
        sucess:true,
        message:'get user Profile',
        data:result
    })
})
// ---------update myprofile------------
const updateMyProfile=catchAsync(async(req:Request,res:Response)=>{
    const user = req.user;
    const result = await userService.updateMyProfie(user as IAuthUser, req);
    sendResponse(res,{
        statusCode:status.OK,
        sucess:true,
        message:'updated my Profile',
        data:result
    })
})
export const userController={
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
}