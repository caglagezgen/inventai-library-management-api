import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().trim().min(1, 'Name is required')
    }),
});

export const userIdParamSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'User ID must be a number'),
    }),
});

export const borrowBookSchema = z.object({
    params: z.object({
        userId: z.string().regex(/^\d+$/, 'User ID must be a number'),
        bookId: z.string().regex(/^\d+$/, 'Book ID must be a number'),
    }),
});

export const returnBookSchema = z.object({
    params: z.object({
        userId: z.string().regex(/^\d+$/, 'User ID must be a number'),
        bookId: z.string().regex(/^\d+$/, 'Book ID must be a number'),
    }),
    body: z.object({
        score: z.number().int().min(1).max(10),
    }),
});