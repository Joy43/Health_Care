import express, { NextFunction, Request, Response, Router }  from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../helpars/fileUploader";
import { userValidation } from "./userValidation";
import validateRequest from "../../middleware/validateRequest";

const router=express.Router();



// -------get upper is betterposition----------
router.get('/',userController.getAllFromDB);
// ---------myprofile--------
router.get('/myprofile',
    auth(UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT,UserRole.SUPER_ADMIN),
    userController.getMyProfile);


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
    "/create-doctor",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        console.log("Received File:", req.file);
        console.log("Raw Body Data:", req.body);
        req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data))
        console.log("Parsed Body:", req.body);
        return userController.createDoctor(req, res, next)
    }
);
// ---------create patient-----------
router.post(
    "/create-patient",
   
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        console.log("Received File:", req.file);
        console.log("Raw Body Data:", req.body);
        req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
        console.log("Parsed Body:", req.body);
        return userController.createPatient(req, res, next)
    }
);

//---------------- profile status-------
router.patch(
    '/:id/status',
    validateRequest(userValidation.updatestatusUser),
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
   
    userController.changeProfileStatus
);
// ---------update profile---------
router.patch(
    "/update-my-profile",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return userController.updateMyProfile(req, res, next)
    }
);

export const userRoutes=router;