import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { BookRepository } from "#repositories/book.repository.js";
import { BookCreateDto } from "#models/book.model.js";

// Mock PrismaClient
vi.mock("@prisma/client", () => {
    const mockPrismaClient = {
        book: {
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    };

    return {
        PrismaClient: vi.fn(() => mockPrismaClient),
    };
});

describe("BookRepository", () => {
    let bookRepository: BookRepository;
    let prisma: PrismaClient;

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Create a new instance of PrismaClient
        prisma = new PrismaClient();

        // Create a new instance of BookRepository with the mocked PrismaClient
        bookRepository = new BookRepository(prisma);
    });

    describe("create", () => {
        it("should create a new book", async () => {
            // Arrange
            const bookData: BookCreateDto = { name: "Test Book" };
            const expectedBook = { id: 1, name: "Test Book", createdAt: new Date(), averageScore: 0, totalScore: 0, ratingsCount: 0 };

            prisma.book.create = vi.fn().mockResolvedValue(expectedBook);

            // Act
            const result = await bookRepository.create(bookData);

            // Assert
            expect(prisma.book.create).toHaveBeenCalledWith({ data: bookData });
            expect(result).toEqual(expectedBook);
        });
    });

    describe("findAll", () => {
        it("should return all books ordered by creation date descending", async () => {
            // Arrange
            const expectedBooks = [
                { id: 1, name: "Book 1", createdAt: new Date(), averageScore: 0, totalScore: 0, ratingsCount: 0 },
                { id: 2, name: "Book 2", createdAt: new Date(), averageScore: 0, totalScore: 0, ratingsCount: 0 }
            ];

            prisma.book.findMany = vi.fn().mockResolvedValue(expectedBooks);

            // Act
            const result = await bookRepository.findAll();

            // Assert
            expect(prisma.book.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
            expect(result).toEqual(expectedBooks);
        });

        it("should return an empty array when no books exist", async () => {
            // Arrange
            prisma.book.findMany = vi.fn().mockResolvedValue([]);

            // Act
            const result = await bookRepository.findAll();

            // Assert
            expect(prisma.book.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
            expect(result).toEqual([]);
        });
    });

    describe("findById", () => {
        it("should return a book when it exists", async () => {
            // Arrange
            const bookId = 1;
            const expectedBook = { id: bookId, name: "Test Book", createdAt: new Date(), averageScore: 0, totalScore: 0, ratingsCount: 0 };

            prisma.book.findUnique = vi.fn().mockResolvedValue(expectedBook);

            // Act
            const result = await bookRepository.findById(bookId);

            // Assert
            expect(prisma.book.findUnique).toHaveBeenCalledWith({ where: { id: bookId } });
            expect(result).toEqual(expectedBook);
        });

        it("should return null when book doesn't exist", async () => {
            // Arrange
            const bookId = 999;

            prisma.book.findUnique = vi.fn().mockResolvedValue(null);

            // Act
            const result = await bookRepository.findById(bookId);

            // Assert
            expect(prisma.book.findUnique).toHaveBeenCalledWith({ where: { id: bookId } });
            expect(result).toBeNull();
        });
    });

    describe("updateScore", () => {
        it("should update a book's score data", async () => {
            // Arrange
            const bookId = 1;
            const totalScore = 10;
            const ratingsCount = 2;
            const averageScore = 5.0;

            const updatedBook = {
                id: bookId,
                name: "Test Book",
                createdAt: new Date(),
                totalScore: totalScore,
                ratingsCount: ratingsCount,
                averageScore: averageScore
            };

            prisma.book.update = vi.fn().mockResolvedValue(updatedBook);

            // Act
            const result = await bookRepository.updateScore(bookId, totalScore, ratingsCount, averageScore);

            // Assert
            expect(prisma.book.update).toHaveBeenCalledWith({
                where: { id: bookId },
                data: {
                    totalScore,
                    ratingsCount,
                    averageScore
                }
            });
            expect(result).toEqual(updatedBook);
        });
    });
});
