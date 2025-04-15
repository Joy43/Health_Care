import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin=async(req:Request,res:Response)=>{
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
    res.status(500).json(
    {
        sucess:false,
        message:err?.name || "something is wrong",
        err:err
    }
    )
   }
};
export const userController={
    createAdmin
}