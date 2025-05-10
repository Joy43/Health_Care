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
exports.userController = void 0;
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../shared/pick"));
const user_constant_1 = require("./user.constant");
// -----------create admin----------------
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('file info', req);
    const result = yield user_service_1.userService.createAdmin(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "Admin Created successfully!",
        data: result,
    });
}));
// -----------------create doctor------------
const createDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('file info', req);
    const result = yield user_service_1.userService.createDoctor(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "DOCTOR Created successfully!",
        data: result,
    });
}));
// ---------------create patient----------
const createPatient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('file info', req);
    const result = yield user_service_1.userService.createPatient(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "Patient Created successfully!",
        data: result,
    });
}));
// ----------get all users---------------
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, user_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    console.log(options);
    const result = yield user_service_1.userService.getAllFromDB(filters, options);
    console.log(options);
    res.status(200).json({
        message: "Users data fetched",
        meta: result.meta,
        data: result.data
    });
}));
// -------------change status user-------------
const changeProfileStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.userService.changeProfileStatus(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "Users profile status changed!",
        data: result
    });
}));
// ---------get myprofile------------
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.userService.getMyProfile(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: 'get user Profile',
        data: result
    });
}));
// ---------update myprofile------------
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.userService.updateMyProfie(user, req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: 'updated my Profile',
        data: result
    });
}));
exports.userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
};
