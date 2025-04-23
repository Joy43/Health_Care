import express, { NextFunction, Request, Response, Router }  from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../helpars/fileUploader";
import { userValidation } from "./userValidation";

const router=express.Router();


// ------------create admin---------
router.post(
    "/create-admin",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        console.log("Received File:", req.file);
        console.log("Raw Body Data:", req.body);
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        console.log("Parsed Body:", req.body);
        return userController.createAdmin(req, res, next)
    }
);

// ------------create doctor---------
router.post(
    "/create-admin",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        console.log("Received File:", req.file);
        console.log("Raw Body Data:", req.body);
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        console.log("Parsed Body:", req.body);
        return userController.createAdmin(req, res, next)
    }
);


export const userRoutes=router;