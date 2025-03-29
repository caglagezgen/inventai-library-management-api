import { Borrowing as PrismaBorrowing } from '@prisma/client';

export type Borrowing = PrismaBorrowing;
export interface ReturnBookDto {
    score: number;
}