import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";


const initPayment = catchAsync(async (req: Request, res: Response) => {
    const { appointmentId } = req.params;
   
    const result = await PaymentService.initPayment(appointmentId);

    sendResponse(res, {
        statusCode: status.OK,
        sucess: true,
        message: "payment initialized successfully",
        data: result
    })
});
const validatePayment=catchAsync(async(req:Request,res:Response)=>{
    const result=await PaymentService.validatePayment(req.query);
    sendResponse(res,{
        statusCode:status.OK,
        sucess:true,
        message:"payment validated successfully",
        data:result
    })
})
export const PaymentController = {
    initPayment,
    validatePayment
}