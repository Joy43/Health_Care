
import { PrismaClient } from '@prisma/client';
import express, { Request,  Response } from 'express';
import { AdminController } from './admin.controller';
const router=express.Router();
const prisma=new PrismaClient
router.get('/',AdminController.getAllFromDB);
router.get('/:id',AdminController.getByIdFromDB);
router.patch('/:id',AdminController.UpdateAdminFromDB);
router.delete("/:id",AdminController.deleteFromDB);
router.delete("/soft/:id",AdminController.SoftdeleteFromDB);
export const AdminRoutes=router;
