import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaClient, Borrowing } from "@prisma/client";
import { BorrowingRepository } from "#repositories/borrowing.repository.js";

// Mock PrismaClient
vi.mock("@prisma/client", () => {
    const mockPrismaClient = {
        borrowing: {
            findFirst: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
        },
    };

    return {
        PrismaClient: vi.fn(() => mockPrismaClient),
    };
});

describe("BorrowingRepository", () => {
    let borrowingRepository: BorrowingRepository;
    let prisma: PrismaClient;

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Create a new instance of PrismaClient
        prisma = new PrismaClient();

        // Create a new instance of BorrowingRepository with the mocked PrismaClient
        borrowingRepository = new BorrowingRepository(prisma);
    });

    describe("findActiveBorrowing", () => {
        it("should find active borrowing for a book", async () => {
            // Arrange
            const bookId = 1;
            const expectedBorrowing: Borrowing = {
                id: 1,
                bookId: bookId,
                userId: 1,
                borrowedAt: new Date(),
                returnedAt: null,
                score: null,
            };

            prisma.borrowing.findFirst = vi.fn().mockResolvedValue(expectedBorrowing);

            // Act
            const result = await borrowingRepository.findActiveBorrowing(bookId);

            // Assert
            expect(prisma.borrowing.findFirst).toHaveBeenCalledWith({
                where: {
                    bookId,
                    returnedAt: null,
                },
            });
            expect(result).toEqual(expectedBorrowing);
        });

        it("should return null when no active borrowing exists for a book", async () => {
            // Arrange
            const bookId = 1;

            prisma.borrowing.findFirst = vi.fn().mockResolvedValue(null);

            // Act
            const result = await borrowingRepository.findActiveBorrowing(bookId);

            // Assert
            expect(prisma.borrowing.findFirst).toHaveBeenCalledWith({
                where: {
                    bookId,
                    returnedAt: null,
                },
            });
            expect(result).toBeNull();
        });
    });

    describe("findUserActiveBorrowing", () => {
        it("should find active borrowing for a user and book", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            const expectedBorrowing: Borrowing = {
                id: 1,
                bookId: bookId,
                userId: userId,
                borrowedAt: new Date(),
                returnedAt: null,
                score: null,
            };

            prisma.borrowing.findFirst = vi.fn().mockResolvedValue(expectedBorrowing);

            // Act
            const result = await borrowingRepository.findUserActiveBorrowing(userId, bookId);

            // Assert
            expect(prisma.borrowing.findFirst).toHaveBeenCalledWith({
                where: {
                    userId,
                    bookId,
                    returnedAt: null,
                },
            });
            expect(result).toEqual(expectedBorrowing);
        });

        it("should return null when no active borrowing exists for a user and book", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;

            prisma.borrowing.findFirst = vi.fn().mockResolvedValue(null);

            // Act
            const result = await borrowingRepository.findUserActiveBorrowing(userId, bookId);

            // Assert
            expect(prisma.borrowing.findFirst).toHaveBeenCalledWith({
                where: {
                    userId,
                    bookId,
                    returnedAt: null,
                },
            });
            expect(result).toBeNull();
        });
    });

    describe("create", () => {
        it("should create a new borrowing record", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            const expectedBorrowing: Borrowing = {
                id: 1,
                userId: userId,
                bookId: bookId,
                borrowedAt: new Date(),
                returnedAt: null,
                score: null,
            };

            prisma.borrowing.create = vi.fn().mockResolvedValue(expectedBorrowing);

            // Act
            const result = await borrowingRepository.create(userId, bookId);

            // Assert
            expect(prisma.borrowing.create).toHaveBeenCalledWith({
                data: {
                    userId,
                    bookId,
                },
            });
            expect(result).toEqual(expectedBorrowing);
        });
    });

    describe("update", () => {
        it("should update a borrowing record", async () => {
            // Arrange
            const borrowingId = 1;
            const updateData = {
                returnedAt: new Date(),
                score: 5,
            };
            const updatedBorrowing: Borrowing = {
                id: borrowingId,
                userId: 1,
                bookId: 1,
                borrowedAt: new Date(),
                returnedAt: updateData.returnedAt,
                score: updateData.score,
            };

            prisma.borrowing.update = vi.fn().mockResolvedValue(updatedBorrowing);

            // Act
            const result = await borrowingRepository.update(borrowingId, updateData);

            // Assert
            expect(prisma.borrowing.update).toHaveBeenCalledWith({
                where: { id: borrowingId },
                data: updateData,
            });
            expect(result).toEqual(updatedBorrowing);
        });
    });
});
