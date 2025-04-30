import prisma from "../../shared/prisma"

const inserIntoDB=async(user:any,payload:{

})=>{
    const doctorData=await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user.email
        }
    });
    const doctorScheduleData=payload.scheduleIds.map(scheduleId=>{
        doctorId:doctorData.id,
        scheduleId
    })
}