"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandaler_1 = __importDefault(require("./app/middleware/globalErrorHandaler"));
const http_status_1 = __importDefault(require("http-status"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ------------- root route--------
app.get('/ ', (req, res) => {
    res.send({
        Message: "health care server --start"
    });
});
// --------------route common-------------
app.use('/api/v1', routes_1.default);
app.use(globalErrorHandaler_1.default);
app.use((err, req, res, next) => {
    res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: "api is not found",
        error: {
            path: req.originalUrl,
            message: "your requested path is not found !"
        }
    });
});
exports.default = app;
