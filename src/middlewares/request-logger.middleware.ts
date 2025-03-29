import { Request, Response, NextFunction } from "express";
import { logger } from "#utils/logger.js";

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    logger.info(`Incoming request: ${req.method} ${req.url}`);

    // Override res.end to capture when the response is sent
    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any, callback?: any): any {
        const duration = Date.now() - start;
        logger.info(`Response: ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
        return originalEnd.call(this, chunk, encoding, callback);
    };

    next();
};
