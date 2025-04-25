
import  { Router } from 'express';
import { DoctorController } from './doctor.controller';


const router = Router();

// ========get specialties------------
router.get("/",DoctorController.getAllFromDB)



export const doctorRoutes = router;
