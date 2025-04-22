import express, { NextFunction, Request, Response, Router }  from "express";
import { userController } from "./user.controller";
import { jwtHelpers } from "../../helpars/jwthelpar";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middleware/validateRequest";
import { adminValidationSchemas } from "../Admin/adminValidation";
import { AdminController } from "../Admin/admin.controller";

const router=express.Router();

router.get("/",auth(UserRole.SUPER_ADMIN),
userController.createAdmin);
router.post("/",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
userController.createAdmin);
router.patch(
    '/:id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
    validateRequest(adminValidationSchemas.update),
    AdminController.UpdateAdminFromDB
);

router.delete(':id',auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),AdminController.deleteFromDB);
export const userRoutes=router;