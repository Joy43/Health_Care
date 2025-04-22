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
exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const admin_constant_1 = require("./admin.constant");
const pick_1 = __importDefault(require("../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, admin_constant_1.adminFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    console.log(options);
    const result = yield admin_service_1.adminService.getAllFromDB(filters, options);
    console.log(options);
    res.status(200).json({
        message: "admin data fetched",
        meta: result.meta,
        data: result.data
    });
}));
// ----------------getbyid-----------------
const getByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.adminService.getByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "Admin data fetched by id!",
        data: result
    });
}));
// ---------------update data-----------------
const UpdateAdminFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log('id', id);
    console.log('data:', req.body);
    const result = yield admin_service_1.adminService.getByIdFromDB(id);
    res.status(200).json({
        success: true,
        message: "admin data update",
        meta: result,
        data: result
    });
}));
// --------delete from db---------
const deleteFromDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield admin_service_1.adminService.DeleteFromDB(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            sucess: true,
            message: "admin is data delete",
            data: result
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: (err === null || err === void 0 ? void 0 : err.name) || "something went wrong",
            name: err
        });
    }
});
// ----------SOFT DELETE----------------
const SoftdeleteFromDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield admin_service_1.adminService.SoftDeleteFromDB(id);
        res.status(200).json({
            success: true,
            message: "admin data deleted !",
            data: result
        });
    }
    catch (err) {
        res.status(500).json({
            sucess: false,
            message: (err === null || err === void 0 ? void 0 : err.name) || "something went wrong",
            name: err
        });
    }
});
exports.AdminController = {
    getAllFromDB,
    getByIdFromDB,
    UpdateAdminFromDB,
    deleteFromDB,
    SoftdeleteFromDB
};
