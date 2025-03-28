import { PrismaClient, Book } from '@prisma/client';
import { BookCreateDto } from '#models/book.model.js';

export class BookRepository {
    constructor(private prisma: PrismaClient) { }

    async create(bookData: BookCreateDto): Promise<Book> {
        return this.prisma.book.create({
            data: bookData,
        });
    }

    async findAll(): Promise<Book[]> {
        return this.prisma.book.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findById(id: number): Promise<Book | null> {
        return this.prisma.book.findUnique({
            where: { id },
        });
    }

    async updateScore(
        id: number,
        totalScore: number,
        ratingsCount: number,
        averageScore: number
    ): Promise<Book> {
        return this.prisma.book.update({
            where: { id },
            data: {
                totalScore,
                ratingsCount,
                averageScore,
            },
        });
    }
}