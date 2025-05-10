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
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.getAllFromDB);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.getByIdFromDB);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(adminValidation_1.adminValidationSchemas.update), admin_controller_1.AdminController.UpdateAdminFromDB);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.deleteFromDB);
router.delete("/soft/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.SoftdeleteFromDB);
exports.AdminRoutes = router;
