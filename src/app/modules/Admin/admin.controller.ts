
import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";
import pick from "../../shared/pick"; 
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
const getAllFromDB=async(req:Request,res:Response)=>{
    try{
      const filters=  pick(req.query,adminFilterableFields);
      const options=pick(req.query,['limit','page','sortBy','sortOrder'])
      console.log(options)
        const result=await adminService.getAllFromDB(filters,options);
    console.log(options);
 
    res.status(200).json({
        message:"admin data fetched",
        meta:result.meta,
        data:result.data
    });
    }catch(err:any){
    res.status(500).json({
   success:false,
   message:err.name,
   err:err
    }
)}
};

// ----------------getbyid-----------------

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: "Admin data fetched by id!",
        data: result
    });
})


// ---------------update data---
const UpdateAdminFromDB=async(req:Request,res:Response)=>{
    const {id}=req.params;
    console.log('id',id);
    console.log('data:',req.body);
   try{
    const result=await adminService.getByIdFromDB(id);
    res.status(200).json({
        success:true,
        message:"admin data update",
        meta:result,
        data:result
    })
   } catch(err:any){
    res.status(500).json({
        success:false,
        message:err?.name || 'something worng',
        err:err
    })
};
};
// --------delete from db---------
const deleteFromDB=async(req:Request,res:Response)=>{
    const {id}=req.params;
    try{
        const result=await adminService.DeleteFromDB(id);
        sendResponse(res,{
            statusCode:status.OK,
            sucess:true,
            message:"admin is data delete",
           
            data:result
        })
    }catch(err:any){
        res.status(500).json({
            success:false,
            message:err?.name || "something went wrong",
            name:err
        })

    }
};

// ----------SOFT DELETE----------------
const SoftdeleteFromDB=async(req:Request,res:Response)=>{
    const {id}=req.params;
    try{
        const result=await adminService.SoftDeleteFromDB(id);
        res.status(200).json({
            success:true,
            message:"admin data deleted !",
            data:result
        })
    }catch(err:any){
        res.status(500).json({
            sucess:false,
            message:err?.name || "something went wrong",
            name:err
        })

    }
}


export const AdminController={
    getAllFromDB,
    getByIdFromDB,
    UpdateAdminFromDB,
    deleteFromDB, 
    SoftdeleteFromDB
}