import express, { Application, NextFunction, Request, Response } from "express";
import cors from 'cors';
import os from 'os';

import router from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandaler";
import status from "http-status";


const app:Application=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// ------------- root route--------
app.get('/', (req: Request, res: Response) => {
    const deviceInfo = {
      hostname: os.hostname(),
      osType: os.type(), 
      osPlatform: os.platform(), 
      osRelease: os.release(), 
      cpuArchitecture: os.arch(), 
      cpuCores: os.cpus().length,
      cpuModel: os.cpus()[0].model,
      totalMemory: `${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`,
      freeMemory: `${(os.freemem() / (1024 ** 3)).toFixed(2)} GB`,
      uptime: `${(os.uptime() / 60).toFixed(2)} minutes`,
      userInfo: os.userInfo(),
      networkInterfaces: os.networkInterfaces(),
      homeDir: os.homedir(),
      tempDir: os.tmpdir()
    };
  
    res.status(200).json({
      success: true,
      message: "Root device/system information retrieved successfully",
      data: deviceInfo
    });
  });
  

// --------------route common-------------
app.use('/api/v1',router);

app.use(globalErrorHandler);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(status.INTERNAL_SERVER_ERROR).send({
        success: false,
        message:  "api is not found",
        error: {
            path:req.originalUrl,
            message:"your requested path is not found !"
        }
    });
})
export default app;