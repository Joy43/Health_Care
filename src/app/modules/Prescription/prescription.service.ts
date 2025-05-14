import { AppointmentStatus, Prescription } from "@prisma/client";
import { IAuthUser } from "../../interface/authuser";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";

const insertIntoDB=async(user:IAuthUser,payload:Partial<Prescription >)=>{
 const  appointmentData=await prisma.appointment.findUniqueOrThrow({
    where:{
        id:payload.appointmentId,
        status:AppointmentStatus.COMPLETED,
       
    },
    include:{
        doctor:true,
    }
 });
 if(user?.email===appointmentData?.doctor.email){
    throw new ApiError(status.BAD_REQUEST,'You are not authorized to access this appointment');
 }
const result=await prisma.prescription.create({
    data:{
        appointmentId:appointmentData.id,
        doctorId:appointmentData.doctorId,
        patientId:appointmentData.patientId,
        followUpDate:payload.followUpDate  || null || undefined,
        instructions:payload.instructions as string,
    },
    include:{
        patient:true,
    }
});
return result;
 console.log(appointmentData);
}


export const PrescriptionService={
insertIntoDB,


}