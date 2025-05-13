
import { IAuthUser } from "../../interface/authuser"
import prisma from "../../shared/prisma"
import { v4 as uuidv4 } from 'uuid';
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helpars/PaginationHelper";
import { AppointmentStatus, PaymentStatus, Prisma, UserRole } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { text } from "stream/consumers";
// --------------appointment service create----------------
const createAppointment=async(user:IAuthUser,payload:any ) =>{
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId
        }
    });

    await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    });

    const videoCallingId: string = uuidv4();

    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            },
            include: {
                patient: true,
                doctor: true,
                schedule: true
            }
        });

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: appointmentData.id
            }
        });

        // PH-HealthCare-datatime
        const today = new Date();

        const transactionId = "PH-HealthCare-" + today.getFullYear() + "-" + today.getMonth() + "-" + today.getDay() + "-" + today.getHours() + "-" + today.getMinutes();

        await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })

        return appointmentData;
    })

    return result;

};

// ----------get my appointment--------
const getMyAppointment = async (user: IAuthUser, filters: any, options: IPaginationOptions) => {

    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { ...filterData } = filters;

    const andConditions: Prisma.AppointmentWhereInput[] = [];

    if (user?.role === UserRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user?.email
            }
        })
    }
    else if (user?.role === UserRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user?.email
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.AppointmentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: user?.role === UserRole.PATIENT
            ? { doctor: true, schedule: true } : { patient: { include: { medicalReport: true, patientHealthData: true } }, schedule: true }
    });

    const total = await prisma.appointment.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};
// --------------get all appointment--------
const getAllFromDB = async (
    filters: any,
    options: IPaginationOptions
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { patientEmail, doctorEmail, ...filterData } = filters;
    const andConditions = [];

    if (patientEmail) {
        andConditions.push({
            patient: {
                email: patientEmail
            }
        })
    }
    else if (doctorEmail) {
        andConditions.push({
            doctor: {
                email: doctorEmail
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return {
                    [key]: {
                        equals: (filterData as any)[key]
                    }
                };
            })
        });
    }

    // console.dir(andConditions, { depth: Infinity })
    const whereConditions: Prisma.AppointmentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                },
        include: {
            doctor: true,
            patient: true
        }
    });
    const total = await prisma.appointment.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};
// --------change4 appointment status--------
const changeAppointmentStatus = async (appiontmentId:string,status:AppointmentStatus,user:IAuthUser) => {
console.log("status",status)
const appointmentData=await prisma.appointment.findFirstOrThrow({
    where:{
        id:appiontmentId
    },
    include:{
        doctor:true,
        patient:true
    }
});

  if (user?.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email)) {
            throw new Error("This is not your appointment!")
        }
    }
const result=await prisma.appointment.update({
    where:{
        id:appiontmentId
    },
    data:{
        status
    }
});
return result;
};
// ---------30 minute before appointment cancel unpaid appointment--------

const cancelUnpaidAppointment=async()=>{
console.log("cancelUnpaidAppointment")
const thirtyMinAgo=new Date(Date.now()-30*60*1000);
const unPaidAppointment=await prisma.appointment.findMany({
    where:{
        createdAt:{
            lte: thirtyMinAgo
        },
        paymentStatus:PaymentStatus.UNPAID,
    }
});
const appointmentIdsToCancel=unPaidAppointment.map((appointment)=>appointment.id);
console.log("appointmentIdsToCancel",appointmentIdsToCancel);
await prisma.$transaction(async(tx)=>{
    await tx.payment.deleteMany({
        where:{
          appointmentId:{
             in:appointmentIdsToCancel
          }
        }
    });
    await tx.appointment.deleteMany({
        where:{
            id:{
                in:appointmentIdsToCancel
            }
        }
    });
    await tx.doctorSchedules.updateMany({
        where:{
            appointmentId:{
                in:appointmentIdsToCancel
            }
        },
        data:{
            isBooked:false,
            appointmentId:null
        }
    });
})
};
export const AppointmentService={
    createAppointment,
    getMyAppointment,
    getAllFromDB,
    changeAppointmentStatus,
    cancelUnpaidAppointment
}