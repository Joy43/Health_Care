
import express from 'express';
import { AuthController } from './auth.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middleware/auth';

const router = express.Router();

router.post(
    '/login',
    AuthController.LoginUser
);

router.post(
    '/refresh-token',
    AuthController.refreshToken
)
router.post(
    '/change-password',
   auth (UserRole.ADMIN,UserRole.DOCTOR,UserRole.SUPER_ADMIN,UserRole.PATIENT),
    AuthController.changePassword
);
router.post(
    '/forgot-password',
    AuthController.forgotPassword
);
router.post(
    '/reset-password',
    AuthController.resetPassword
);






export const AuthRoutes = router;