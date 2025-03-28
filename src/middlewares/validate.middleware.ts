import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validate = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error: any) {
            // TODO: validate this is not continue in middleware flow
            // instead throw a custom input validation error, and handle it in global error handler
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: error.errors,
            });
        }
    };
};