import express from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';
import { PrescriptionController } from './prescription.controller';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),

);

router.get(
    '/my-prescription',
    auth(UserRole.PATIENT),
    
)

router.post(
    '/',
    auth(UserRole.DOCTOR),
    PrescriptionController.insertIntoDB
   
)


export const PrescriptionRoutes = router;