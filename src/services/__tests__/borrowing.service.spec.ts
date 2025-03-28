import { describe, it, expect, beforeEach, vi } from "vitest";
import { BorrowingService } from "#services/borrowing.service.js";
import { BorrowingRepository } from "#repositories/borrowing.repository.js";
import { BookRepository } from "#repositories/book.repository.js";
import { UserRepository } from "#repositories/user.repository.js";
import { ReturnBookDto } from "#models/borrowing.model.js";
import { AppError } from "#utils/app-error.js";

// Mock repositories
vi.mock("#repositories/borrowing.repository.js", () => {
    return {
        BorrowingRepository: vi.fn(() => ({
            findActiveBorrowing: vi.fn(),
            findUserActiveBorrowing: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
        })),
    };
});

vi.mock("#repositories/book.repository.js", () => {
    return {
        BookRepository: vi.fn(() => ({
            findById: vi.fn(),
            updateScore: vi.fn(),
        })),
    };
});

vi.mock("#repositories/user.repository.js", () => {
    return {
        UserRepository: vi.fn(() => ({
            findById: vi.fn(),
        })),
    };
});

describe("BorrowingService", () => {
    let borrowingService: BorrowingService;
    let borrowingRepository: BorrowingRepository;
    let bookRepository: BookRepository;
    let userRepository: UserRepository;

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Create new instances of repositories
        borrowingRepository = new BorrowingRepository({} as any);
        bookRepository = new BookRepository({} as any);
        userRepository = new UserRepository({} as any);

        // Create a new instance of BorrowingService with the mocked repositories
        borrowingService = new BorrowingService(borrowingRepository, bookRepository, userRepository);
    });

    describe("borrowBook", () => {
        it("should successfully create a borrowing record when book is available", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;

            borrowingRepository.findActiveBorrowing = vi.fn().mockResolvedValue(null);
            userRepository.findById = vi.fn().mockResolvedValue({ id: userId, name: "Test User" });
            bookRepository.findById = vi.fn().mockResolvedValue({
                id: bookId,
                name: "Test Book",
                createdAt: new Date(),
                averageScore: 0,
                totalScore: 0,
                ratingsCount: 0
            });
            borrowingRepository.create = vi.fn().mockResolvedValue({
                id: 1,
                userId,
                bookId,
                borrowedAt: new Date(),
                returnedAt: null,
                score: null
            });

            // Act
            await borrowingService.borrowBook(userId, bookId);

            // Assert
            expect(borrowingRepository.findActiveBorrowing).toHaveBeenCalledWith(bookId);
            expect(userRepository.findById).toHaveBeenCalledWith(userId);
            expect(bookRepository.findById).toHaveBeenCalledWith(bookId);
            expect(borrowingRepository.create).toHaveBeenCalledWith(userId, bookId);
        });

        it("should throw AppError when book is already borrowed", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;

            borrowingRepository.findActiveBorrowing = vi.fn().mockResolvedValue({
                id: 2,
                userId: 2,
                bookId,
                borrowedAt: new Date(),
                returnedAt: null,
                score: null
            });

            // Act & Assert
            await expect(borrowingService.borrowBook(userId, bookId))
                .rejects.toThrow(AppError);
            await expect(borrowingService.borrowBook(userId, bookId))
                .rejects.toThrow("Someone already borrowed this book and hasn't returned it yet.");

            expect(borrowingRepository.findActiveBorrowing).toHaveBeenCalledWith(bookId);
            expect(userRepository.findById).not.toHaveBeenCalled();
            expect(bookRepository.findById).not.toHaveBeenCalled();
            expect(borrowingRepository.create).not.toHaveBeenCalled();
        });

        it("should throw AppError when user is not found", async () => {
            // Arrange
            const userId = 999;
            const bookId = 1;

            borrowingRepository.findActiveBorrowing = vi.fn().mockResolvedValue(null);
            userRepository.findById = vi.fn().mockResolvedValue(null);

            // Act & Assert
            await expect(borrowingService.borrowBook(userId, bookId))
                .rejects.toThrow(AppError);
            await expect(borrowingService.borrowBook(userId, bookId))
                .rejects.toThrow("User not found.");

            expect(borrowingRepository.findActiveBorrowing).toHaveBeenCalledWith(bookId);
            expect(userRepository.findById).toHaveBeenCalledWith(userId);
            expect(bookRepository.findById).not.toHaveBeenCalled();
            expect(borrowingRepository.create).not.toHaveBeenCalled();
        });

        it("should throw AppError when book is not found", async () => {
            // Arrange
            const userId = 1;
            const bookId = 999;

            borrowingRepository.findActiveBorrowing = vi.fn().mockResolvedValue(null);
            userRepository.findById = vi.fn().mockResolvedValue({ id: userId, name: "Test User" });
            bookRepository.findById = vi.fn().mockResolvedValue(null);

            // Act & Assert
            await expect(borrowingService.borrowBook(userId, bookId))
                .rejects.toThrow(AppError);
            await expect(borrowingService.borrowBook(userId, bookId))
                .rejects.toThrow("Book not found.");

            expect(borrowingRepository.findActiveBorrowing).toHaveBeenCalledWith(bookId);
            expect(userRepository.findById).toHaveBeenCalledWith(userId);
            expect(bookRepository.findById).toHaveBeenCalledWith(bookId);
            expect(borrowingRepository.create).not.toHaveBeenCalled();
        });
    });

    describe("returnBook", () => {
        it("should successfully update borrowing record and book scores", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            const borrowingId = 1;
            const returnData: ReturnBookDto = { score: 5 };

            const existingBorrowing = {
                id: borrowingId,
                userId,
                bookId,
                borrowedAt: new Date(),
                returnedAt: null,
                score: null
            };

            const existingBook = {
                id: bookId,
                name: "Test Book",
                createdAt: new Date(),
                averageScore: 4.0,
                totalScore: 8,
                ratingsCount: 2
            };

            borrowingRepository.findUserActiveBorrowing = vi.fn().mockResolvedValue(existingBorrowing);
            bookRepository.findById = vi.fn().mockResolvedValue(existingBook);
            borrowingRepository.update = vi.fn().mockResolvedValue({
                ...existingBorrowing,
                returnedAt: expect.any(Date),
                score: returnData.score
            });
            bookRepository.updateScore = vi.fn().mockResolvedValue({
                ...existingBook,
                totalScore: 13,
                ratingsCount: 3,
                averageScore: 4.33
            });

            // Act
            await borrowingService.returnBook(userId, bookId, returnData);

            // Assert
            expect(borrowingRepository.findUserActiveBorrowing).toHaveBeenCalledWith(userId, bookId);
            expect(borrowingRepository.update).toHaveBeenCalledWith(borrowingId, {
                returnedAt: expect.any(Date),
                score: returnData.score
            });
            expect(bookRepository.findById).toHaveBeenCalledWith(bookId);
            expect(bookRepository.updateScore).toHaveBeenCalledWith(
                bookId,
                13, // 8 + 5
                3,  // 2 + 1
                13 / 3 // new average
            );
        });

        it("should throw AppError when no active borrowing is found", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            const returnData: ReturnBookDto = { score: 5 };

            borrowingRepository.findUserActiveBorrowing = vi.fn().mockResolvedValue(null);

            // Act & Assert
            await expect(borrowingService.returnBook(userId, bookId, returnData))
                .rejects.toThrow(AppError);
            await expect(borrowingService.returnBook(userId, bookId, returnData))
                .rejects.toThrow("No active borrowing found for the specified user and book.");

            expect(borrowingRepository.findUserActiveBorrowing).toHaveBeenCalledWith(userId, bookId);
            expect(borrowingRepository.update).not.toHaveBeenCalled();
            expect(bookRepository.findById).not.toHaveBeenCalled();
            expect(bookRepository.updateScore).not.toHaveBeenCalled();
        });

        it("should throw AppError when book is not found", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            const borrowingId = 1;
            const returnData: ReturnBookDto = { score: 5 };

            borrowingRepository.findUserActiveBorrowing = vi.fn().mockResolvedValue({
                id: borrowingId,
                userId,
                bookId,
                borrowedAt: new Date(),
                returnedAt: null,
                score: null
            });
            bookRepository.findById = vi.fn().mockResolvedValue(null);

            // Act & Assert
            await expect(borrowingService.returnBook(userId, bookId, returnData))
                .rejects.toThrow(AppError);
            await expect(borrowingService.returnBook(userId, bookId, returnData))
                .rejects.toThrow("Book not found.");

            expect(borrowingRepository.findUserActiveBorrowing).toHaveBeenCalledWith(userId, bookId);
            expect(borrowingRepository.update).toHaveBeenCalledWith(borrowingId, {
                returnedAt: expect.any(Date),
                score: returnData.score
            });
            expect(bookRepository.findById).toHaveBeenCalledWith(bookId);
            expect(bookRepository.updateScore).not.toHaveBeenCalled();
        });

        it("should handle book with null score values", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            const borrowingId = 1;
            const returnData: ReturnBookDto = { score: 5 };

            borrowingRepository.findUserActiveBorrowing = vi.fn().mockResolvedValue({
                id: borrowingId,
                userId,
                bookId,
                borrowedAt: new Date(),
                returnedAt: null,
                score: null
            });

            bookRepository.findById = vi.fn().mockResolvedValue({
                id: bookId,
                name: "Test Book",
                createdAt: new Date(),
                averageScore: null,
                totalScore: null,
                ratingsCount: null
            });

            // Act
            await borrowingService.returnBook(userId, bookId, returnData);

            // Assert
            expect(bookRepository.updateScore).toHaveBeenCalledWith(
                bookId,
                5, // 0 + 5 when totalScore is null
                1, // 0 + 1 when ratingsCount is null
                5  // 5/1 new average
            );
        });
    });
});
