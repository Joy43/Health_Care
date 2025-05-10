"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const os_1 = __importDefault(require("os"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandaler_1 = __importDefault(require("./app/middleware/globalErrorHandaler"));
const http_status_1 = __importDefault(require("http-status"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ------------- root route--------
app.get('/', (req, res) => {
    const deviceInfo = {
        hostname: os_1.default.hostname(),
        osType: os_1.default.type(),
        osPlatform: os_1.default.platform(),
        osRelease: os_1.default.release(),
        cpuArchitecture: os_1.default.arch(),
        cpuCores: os_1.default.cpus().length,
        cpuModel: os_1.default.cpus()[0].model,
        totalMemory: `${(os_1.default.totalmem() / (1024 ** 3)).toFixed(2)} GB`,
        freeMemory: `${(os_1.default.freemem() / (1024 ** 3)).toFixed(2)} GB`,
        uptime: `${(os_1.default.uptime() / 60).toFixed(2)} minutes`,
        userInfo: os_1.default.userInfo(),
        networkInterfaces: os_1.default.networkInterfaces(),
        homeDir: os_1.default.homedir(),
        tempDir: os_1.default.tmpdir()
    };
    res.status(200).json({
        success: true,
        message: "Root device/system information retrieved successfully",
        data: deviceInfo
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
