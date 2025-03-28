import { z } from 'zod';

export const createBookSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Book name is required'),
    }),
});

export const bookIdParamSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'Book ID must be a number'),
    }),
});