import { Borrowing as PrismaBorrowing } from '@prisma/client';

// Use Prisma's generated type as a base
export type Borrowing = PrismaBorrowing;

// DTOs and specialized types
export interface ReturnBookDto {
    score: number;
}