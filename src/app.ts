import express, { Application, NextFunction, Request, Response } from "express";
import cors from 'cors';

import router from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandaler";
import status from "http-status";


const app:Application=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// ------------- root route--------
app.get('/ ', (req: Request, res: Response) => {
res.send({
    Message:"health care server --start"
})
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