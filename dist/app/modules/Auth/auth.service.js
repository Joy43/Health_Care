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
exports.Authservice = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwthelpar_1 = require("../../helpars/jwthelpar");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const emailSender_1 = __importDefault(require("./emailSender"));
// -------------login user-----------------
const LoginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const accessToken = jwthelpar_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwthelpar_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
});
// --------------refresh password--------------
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwthelpar_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const accessToken = jwthelpar_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };
});
// -----------------chage password----------------
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    });
    return {
        message: "Password changed successfully!"
    };
});
// -----------------forgot password------------
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const resetPassToken = jwthelpar_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_token_expires_in);
    console.log(resetPassToken);
    const resetPassLink = config_1.default.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
    yield (0, emailSender_1.default)(userData.email, `
   <div 
   style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #4A90E2;">Password Reset Request</h2>
    <p>Dear User,</p>
    <p>We received a request to reset your password. Click the button below to set a new password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetPassLink}" style="background-color: #4A90E2; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Reset Password
      </a>
    </div>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p>Best regards,<br />Your Support Team</p>
  </div>
</div>

        `);
    console.log(resetPassLink);
});
// -----------------reset password------------
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ token, payload });
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isValidToken = jwthelpar_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_pass_secret);
    if (!isValidToken) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
    }
    // hash password
    const password = yield bcrypt_1.default.hash(payload.password, 12);
    // update into database
    yield prisma_1.default.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    });
});
exports.Authservice = {
    LoginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};
