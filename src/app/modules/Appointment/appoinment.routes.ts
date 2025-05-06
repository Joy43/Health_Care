import express from 'express';
import { AppointmentController } from './appointment.controller';

const router=express.Router();

// -------------create doctor validation------------
router.post(
    '/',AppointmentController.createAppointment);

export const AppoinmentRoutes=router;