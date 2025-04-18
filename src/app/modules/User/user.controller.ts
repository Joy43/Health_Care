import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";


// -----------create admin----------------
const createAdmin=async(req:Request,res:Response,next:NextFunction)=>{
    console.log(req.body)
    console.log('user controller');
   try{
    const result=await userService.createAdmin(req.body);
    res.status(200).json({
      status:true,
      messsage:'Admin create successfuly',
      data:result
    })
}catch(err:any){
    next (err)
   }
};
export const userController={
    createAdmin
}