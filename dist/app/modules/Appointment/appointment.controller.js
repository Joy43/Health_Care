"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const appointment_service_1 = require("./appointment.service");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const appoinment_constant_1 = require("./appoinment.constant");
const createAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield appointment_service_1.AppointmentService.createAppointment(user, req.body);
    res.status(200).json({
        status: http_status_1.default.CREATED,
        message: "appointment created successfully",
        data: result
    });
}));
// --------------get appointment------------------
const getMyAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const filters = (0, pick_1.default)(req.query, ['status', 'paymentStatus']);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = yield appointment_service_1.AppointmentService.getMyAppointment(user, filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: 'My Appointment retrive successfully',
        data: result
    });
}));
// --------------get appointment by id------------------
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, appoinment_constant_1.appointmentFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = yield appointment_service_1.AppointmentService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: 'Appointment retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
}));
exports.AppointmentController = {
    createAppointment,
    getMyAppointment,
    getAllFromDB
};
