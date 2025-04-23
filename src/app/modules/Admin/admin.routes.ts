
import { PrismaClient, UserRole } from '@prisma/client';
import express, { Request,  Response } from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middleware/validateRequest';
import { adminValidationSchemas } from './adminValidation';
import auth from '../../middleware/auth';
const router=express.Router();

router.get('/',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.getAllFromDB);
router.get('/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.getByIdFromDB);
router.patch(
    '/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validateRequest
    (adminValidationSchemas.update),AdminController.UpdateAdminFromDB);
     
router.delete("/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.deleteFromDB);
router.delete("/soft/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.SoftdeleteFromDB);
export const AdminRoutes=router;
