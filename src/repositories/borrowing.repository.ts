import { PrismaClient, Borrowing } from '@prisma/client';

export class BorrowingRepository {
    constructor(private prisma: PrismaClient) { }

    // convert this function name to findBookActiveBorrowing
    async findActiveBorrowing(bookId: number): Promise<Borrowing | null> {
        return this.prisma.borrowing.findFirst({
            where: {
                bookId,
                returnedAt: null,
            },
        });
    }

    async findUserActiveBorrowing(userId: number, bookId: number): Promise<Borrowing | null> {
        return this.prisma.borrowing.findFirst({
            where: {
                userId,
                bookId,
                returnedAt: null,
            },
        });
    }

    async create(userId: number, bookId: number): Promise<Borrowing> {
        return this.prisma.borrowing.create({
            data: {
                userId,
                bookId,
            },
        });
    }

    async update(id: number, data: Partial<Borrowing>): Promise<Borrowing> {
        return this.prisma.borrowing.update({
            where: { id },
            data,
        });
    }
}