import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export const validate = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse and transform the request data
            const result = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });

            // Replace the request properties with the transformed values
            req.body = result.body;
            req.query = result.query;
            req.params = result.params;
            next();
        } catch (error: any) {
            // TODO: validate this is not continue in middleware flow. Ensure about this.
            res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: error.errors
            });
        }
    };
};
