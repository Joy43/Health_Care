"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../helpars/fileUploader");
const userValidation_1 = require("./userValidation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = express_1.default.Router();
// -------get upper is betterposition----------
router.get('/', user_controller_1.userController.getAllFromDB);
// ---------myprofile--------
router.get('/myprofile', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT, client_1.UserRole.SUPER_ADMIN), user_controller_1.userController.getMyProfile);
// ------------create admin---------
router.post("/create-admin", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    console.log("Received File:", req.file);
    console.log("Raw Body Data:", req.body);
    req.body = userValidation_1.userValidation.createAdmin.parse(JSON.parse(req.body.data));
    console.log("Parsed Body:", req.body);
    return user_controller_1.userController.createAdmin(req, res, next);
});
// ------------create doctor---------
router.post("/create-doctor", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    console.log("Received File:", req.file);
    console.log("Raw Body Data:", req.body);
    req.body = userValidation_1.userValidation.createDoctor.parse(JSON.parse(req.body.data));
    console.log("Parsed Body:", req.body);
    return user_controller_1.userController.createDoctor(req, res, next);
});
// ---------create patient-----------
router.post("/create-patient", fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    console.log("Received File:", req.file);
    console.log("Raw Body Data:", req.body);
    req.body = userValidation_1.userValidation.createPatient.parse(JSON.parse(req.body.data));
    console.log("Parsed Body:", req.body);
    return user_controller_1.userController.createPatient(req, res, next);
});
//---------------- profile status-------
router.patch('/:id/status', (0, validateRequest_1.default)(userValidation_1.userValidation.updatestatusUser), (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), user_controller_1.userController.changeProfileStatus);
// ---------update profile---------
router.patch("/update-my-profile", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.DOCTOR, client_1.UserRole.PATIENT), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controller_1.userController.updateMyProfile(req, res, next);
});
exports.userRoutes = router;
