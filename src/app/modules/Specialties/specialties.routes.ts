
import express, { NextFunction, Request, Response } from 'express';
import { specialtiesController } from './specialties.controller';
import { fileUploader } from '../../helpars/fileUploader';
import { SpecialtiesValidation } from './specialties.validation';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';
const router = express.Router();

// ========get specialties------------
router.get("/",
    auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),
    specialtiesController.GetSpecialtie)
// --------create specialties========
router.post(
    "/",
   fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
       
        req.body =SpecialtiesValidation.createSpecialties.parse( JSON.parse(req.body.data))
        console.log("Parsed Body:", req.body);
        return specialtiesController.insetIntoDB(req, res, next)
    }
);
// ---------- Delete---------------
router.delete("/:id",
    auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),
    specialtiesController.DeleteSpecialties)
export const specialtiesRoutes = router;
