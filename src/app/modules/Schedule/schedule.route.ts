
import express, { NextFunction, Request, Response } from 'express';
import { ScheduleController } from './schedule.controller';

const router = express.Router();

router.post('/',ScheduleController.inserIntoDB);

export const scheduleRoutes = router;
