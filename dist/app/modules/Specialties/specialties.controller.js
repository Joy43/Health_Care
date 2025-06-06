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
exports.specialtiesController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const specialties_service_1 = require("./specialties.service");
const insetIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield specialties_service_1.SpecialtiesService.insertIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "specialties created successfully!",
        data: result
    });
}));
// -----get data----------
const GetSpecialtie = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield specialties_service_1.SpecialtiesService.GetSpecialties();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "Get specialties successfully",
        data: result
    });
}));
// -----------delete data---------
const DeleteSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield specialties_service_1.SpecialtiesService.DeleteSpecialties(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "specialties Delete successfully",
        data: result
    });
}));
exports.specialtiesController = {
    insetIntoDB,
    GetSpecialtie,
    DeleteSpecialties
};
