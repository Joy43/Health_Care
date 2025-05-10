"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRoutes = void 0;
const express_1 = require("express");
const doctor_controller_1 = require("./doctor.controller");
const router = (0, express_1.Router)();
// ========get specialties------------
router.get("/", doctor_controller_1.DoctorController.getAllFromDB);
exports.doctorRoutes = router;
