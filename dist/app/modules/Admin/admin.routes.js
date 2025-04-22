"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const adminValidation_1 = require("./adminValidation");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient;
router.get('/', admin_controller_1.AdminController.getAllFromDB);
router.get('/:id', admin_controller_1.AdminController.getByIdFromDB);
router.patch('/:id', (0, validateRequest_1.default)(adminValidation_1.adminValidationSchemas.update), admin_controller_1.AdminController.UpdateAdminFromDB);
router.delete("/:id", admin_controller_1.AdminController.deleteFromDB);
router.delete("/soft/:id", admin_controller_1.AdminController.SoftdeleteFromDB);
exports.AdminRoutes = router;
