import { User as PrismaUser, Borrowing as PrismaBorrowing } from '@prisma/client';

export type User = Pick<PrismaUser, 'id' | 'name'>;

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

export type UserWithBorrowings = User & {
    borrowings: (PrismaBorrowing & {
        book: {
            name: string;
        };
    })[];
};
