
import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";
import pick from "../../shared/pick"; 
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
    res.status(5000).json({
   sucess:false,
   message:err.name,
   err:err
    }
)}
}
export const AdminController={
    getAllFromDB
}