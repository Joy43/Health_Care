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
exports.DoctorController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const doctor_service_1 = require("./doctor.service");
const pick_1 = __importDefault(require("../../shared/pick"));
const doctor_constant_1 = require("./doctor.constant");
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, doctor_constant_1.doctorFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = yield doctor_service_1.DoctorService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: 'Doctors retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// -------------------uodate-------------------
// const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const result = await DoctorService.updateIntoDB(id, req.body);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Doctor data updated!",
//         data: result
//     })
// });
exports.DoctorController = {
    getAllFromDB,
};
