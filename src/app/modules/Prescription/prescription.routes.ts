import express from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

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
   
)


export const PrescriptionRoutes = router;