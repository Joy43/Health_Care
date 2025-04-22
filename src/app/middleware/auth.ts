import { NextFunction, Request, Response } from "express"
import { jwtHelpers } from "../helpars/jwthelpar"
import config from "../../config"
import { Secret } from "jsonwebtoken"
import ApiError from "../errors/ApiError";
import status from "http-status";
import { verify } from "crypto";

const auth=(...roles:string[])=>{
    return async(req:Request & {user?:any},res:Response,next:NextFunction)=>{
     try{
         const token=req.headers.authorization
         console.log(token)
         if(!token){
             throw new ApiError(status.UNAUTHORIZED,"you are not authorization")
         }
         const varifiedUser=jwtHelpers.verifyToken(token,config.jwt.jwt_secret as Secret);
         console.log(varifiedUser);
         req.user=varifiedUser;
         if(roles.length && !roles.includes(varifiedUser.role)){
             throw new ApiError(status.FORBIDDEN,"you are not authorization")
 
         }
         next()
     }catch(err){
 next(err)
     }
    }
 
 };
 export default auth;