import { Request, Response } from "express"
import { IAuthUser } from "../../interface/authuser"
import prisma from "../../shared/prisma"

const createAppointment=async(user:IAuthUser,payload:any ) =>{
    console.log("appointment !!")
    const patientData=await prisma.patient.findUniqueOrThrow({
        where:{
            email:user?.email
        }
    })
    console.log("patientData",patientData)
}


export const AppointmentService={
    createAppointment
}