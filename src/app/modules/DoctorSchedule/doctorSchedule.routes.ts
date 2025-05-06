import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { DoctorScheduleController } from './doctorSchedule.controller';
import { DoctorScheduleValidation } from './doctorSchedule.validation';
import { UserRole } from '@prisma/client';
const router=express.Router();

// -------------create doctor validation------------
router.post(
    '/',
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.create),
    DoctorScheduleController.insertIntoDB
);

export const doctorScheduleRoutes=router;