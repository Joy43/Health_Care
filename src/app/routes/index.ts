import exprss from 'express';
import { userRoutes } from '../modules/User/user.routes';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { specialtiesRoutes } from '../modules/Specialties/specialties.routes';
import { doctorRoutes } from '../modules/Doctor/doctor.routes';
import { PatientRoutes } from '../modules/patient/patient.routes';
import { scheduleRoutes } from '../modules/Schedule/schedule.route';

import { AppoinmentRoutes } from '../modules/Appointment/appoinment.routes';
import { DoctorScheduleRoutes } from '../modules/DoctorSchedule/doctorSchedule.routes';
import { PaymentRoutes } from '../modules/Payment/payment.routes';
import { PrescriptionRoutes } from '../modules/Prescription/prescription.routes';
import { ReviewRoutes } from '../modules/Review/review.routes';



const router=exprss.Router();

const moduleRoutes=[
    {
        path:'/user',
        route:userRoutes
    },
    {
        path:'/admin',
        route:AdminRoutes
    },
    {
        path:'/auth',
        route:AuthRoutes
    },
    {
        path:'/specialties',
        route:specialtiesRoutes
    },
    {
        path:'/doctor',
        route:doctorRoutes 
    },
    {
        path:'/patient',
        route:PatientRoutes
    },
    {
        path:'/schedule',
        route:scheduleRoutes
    },
    {
        path:'/doctor-schedule',
        route:DoctorScheduleRoutes
    },
    {
        path:'/appoinment',
        route:AppoinmentRoutes
    },
    {
        path:'/payment',
        route:PaymentRoutes
    },
    {
        path:'/prescription',
        route:PrescriptionRoutes
    },
    {
        path:'/review',
        route:ReviewRoutes
    }


  
  
];

moduleRoutes.forEach(route=>router.use(route.path,route.route))

export default router;