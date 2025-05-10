"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const admin_routes_1 = require("../modules/Admin/admin.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const specialties_routes_1 = require("../modules/Specialties/specialties.routes");
const doctor_routes_1 = require("../modules/Doctor/doctor.routes");
const patient_routes_1 = require("../modules/patient/patient.routes");
const schedule_route_1 = require("../modules/Schedule/schedule.route");
const appoinment_routes_1 = require("../modules/Appointment/appoinment.routes");
const doctorSchedule_routes_1 = require("../modules/DoctorSchedule/doctorSchedule.routes");
const payment_routes_1 = require("../modules/Payment/payment.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/user',
        route: user_routes_1.userRoutes
    },
    {
        path: '/admin',
        route: admin_routes_1.AdminRoutes
    },
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes
    },
    {
        path: '/specialties',
        route: specialties_routes_1.specialtiesRoutes
    },
    {
        path: '/doctor',
        route: doctor_routes_1.doctorRoutes
    },
    {
        path: '/patient',
        route: patient_routes_1.PatientRoutes
    },
    {
        path: '/schedule',
        route: schedule_route_1.scheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorSchedule_routes_1.DoctorScheduleRoutes
    },
    {
        path: '/appoinment',
        route: appoinment_routes_1.AppoinmentRoutes
    },
    {
        path: '/payment',
        route: payment_routes_1.PaymentRoutes
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
