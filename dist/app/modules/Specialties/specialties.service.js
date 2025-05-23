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
exports.SpecialtiesService = void 0;
const fileUploader_1 = require("../../helpars/fileUploader");
const prisma_1 = __importDefault(require("../../shared/prisma"));
// -----------------Get---------------
const insertIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudanry = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudanry === null || uploadToCloudanry === void 0 ? void 0 : uploadToCloudanry.secure_url;
    }
    ;
    const result = yield prisma_1.default.specialties.create({
        data: req.body
    });
    return result;
});
// ---------get specilist data-------------
const GetSpecialties = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(GetSpecialties);
    const result = yield prisma_1.default.specialties.findMany();
    return result;
});
// -----------delete specific id-----
const DeleteSpecialties = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.specialties.delete({
        where: { id }
    });
    return result;
});
exports.SpecialtiesService = {
    insertIntoDB,
    GetSpecialties,
    DeleteSpecialties
};
