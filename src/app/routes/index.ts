import exprss from 'express';
import { userRoutes } from '../modules/User/user.routes';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { specialtiesRoutes } from '../modules/Specialties/specialties.routes';
import { doctorRoutes } from '../modules/Doctor/doctor.routes';


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
    }
  
  
];

moduleRoutes.forEach(route=>router.use(route.path,route.route))

export default router;