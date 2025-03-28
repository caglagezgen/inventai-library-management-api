import { User as PrismaUser, Borrowing as PrismaBorrowing } from '@prisma/client';

// Use Prisma's generated type as a base
export type User = Pick<PrismaUser, 'id' | 'name'>;

// DTOs and specialized types
export interface UserCreateDto {
    name: string;
}

export interface UserWithBorrowingHistory {
    id: number;
    name: string;
    books: {
        past: PastBorrowing[];
        present: PresentBorrowing[];
    };
}

export interface PastBorrowing {
    name: string;
    userScore: number | null;
}

export interface PresentBorrowing {
    name: string;
}

// Extended types for specific use cases
export type UserWithBorrowings = User & {
    borrowings: (PrismaBorrowing & {
        book: {
            name: string;
        };
    })[];
};
