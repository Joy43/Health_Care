import { NextFunction, Request, Response } from "express";
import status from "http-status";

const globalErrorHandler=(err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(status.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: err.message || "something went to worng",
        error: err
    });
}
export default globalErrorHandler;