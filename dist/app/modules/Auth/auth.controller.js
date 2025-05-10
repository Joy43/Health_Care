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
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
// --------------login user-------------
const LoginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.Authservice.LoginUser(req.body);
    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: false,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "login sucessfully",
        data: result
    });
}));
// ---------refresh token-----------------
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.Authservice.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "Access token genereated successfully!",
        data: result
    });
}));
// ------------------chnage password now-----------------
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield auth_service_1.Authservice.changePassword(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "chnage password successfully!",
        data: result
    });
}));
// -----------------forgot passowrd-----------
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_service_1.Authservice.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "Check your email!",
        data: null
    });
}));
// ------------reset password--------------
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || "";
    const result = yield auth_service_1.Authservice.resetPassword(token, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        sucess: true,
        message: "Reset password successfully!",
        data: result
    });
}));
exports.AuthController = {
    LoginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};
