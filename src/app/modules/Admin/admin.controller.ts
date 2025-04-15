
import { Request, Response } from "express";
import { adminService } from "./admin.service";



const getAllFromDB=async(req:Request,res:Response)=>{
    try{
        const result=await adminService.getAllFromDB(req.query);
    console.log(req.query);
 
    res.status(200).json({
        message:"admin data fetched",
        data:result
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