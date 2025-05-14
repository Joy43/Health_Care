import express from 'express'
import { ReviewController } from './review.controller';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middleware/validateRequest';


const router = express.Router();

// router.get('/', ReviewController.getAllFromDB);

router.post(
    '/',
    auth(UserRole.PATIENT),
 
    ReviewController.insertIntoDB
);


export const ReviewRoutes = router;