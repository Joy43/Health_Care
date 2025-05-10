"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtiesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const specialties_controller_1 = require("./specialties.controller");
const fileUploader_1 = require("../../helpars/fileUploader");
const specialties_validation_1 = require("./specialties.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// ========get specialties------------
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), specialties_controller_1.specialtiesController.GetSpecialtie);
// --------create specialties========
router.post("/", fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = specialties_validation_1.SpecialtiesValidation.createSpecialties.parse(JSON.parse(req.body.data));
    console.log("Parsed Body:", req.body);
    return specialties_controller_1.specialtiesController.insetIntoDB(req, res, next);
});
// ---------- Delete---------------
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), specialties_controller_1.specialtiesController.DeleteSpecialties);
exports.specialtiesRoutes = router;
