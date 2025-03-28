import { describe, it, expect, beforeEach, vi } from "vitest";
import { BookService } from "#services/book.service.js";
import { BookRepository } from "#repositories/book.repository.js";
import { Book, BookCreateDto } from "#models/book.model.js";
import { AppError } from "#utils/app-error.js";

// Mock BookRepository
vi.mock("#repositories/book.repository.js", () => {
    return {
        BookRepository: vi.fn(() => ({
            create: vi.fn(),
            findAll: vi.fn(),
            findById: vi.fn(),
        })),
    };
});

describe("BookService", () => {
    let bookService: BookService;
    let bookRepository: BookRepository;

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Create a new instance of BookRepository
        bookRepository = new BookRepository({} as any);

        // Create a new instance of BookService with the mocked BookRepository
        bookService = new BookService(bookRepository);
    });

    describe("createBook", () => {
        it("should create a new book", async () => {
            // Arrange
            const bookData: BookCreateDto = { name: "Test Book" };
            const createdBook: Book = {
                id: 1,
                name: "Test Book",
                createdAt: new Date(),
                averageScore: 0,
                totalScore: 0,
                ratingsCount: 0
            };

            bookRepository.create = vi.fn().mockResolvedValue(createdBook);

            // Act
            const result = await bookService.createBook(bookData);

            // Assert
            expect(bookRepository.create).toHaveBeenCalledWith(bookData);
            expect(result).toEqual({
                id: 1,
                name: "Test Book",
            });
        });
    });

    describe("getAllBooks", () => {
        it("should return all books", async () => {
            // Arrange
            const mockBooks: Book[] = [
                { id: 1, name: "Book 1", createdAt: new Date(), averageScore: 4.5, totalScore: 9, ratingsCount: 2 },
                { id: 2, name: "Book 2", createdAt: new Date(), averageScore: 3.0, totalScore: 6, ratingsCount: 2 },
            ];

            bookRepository.findAll = vi.fn().mockResolvedValue(mockBooks);

            // Act
            const result = await bookService.getAllBooks();

            // Assert
            expect(bookRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual([
                { id: 1, name: "Book 1" },
                { id: 2, name: "Book 2" },
            ]);
        });

        it("should return an empty array when no books exist", async () => {
            // Arrange
            bookRepository.findAll = vi.fn().mockResolvedValue([]);

            // Act
            const result = await bookService.getAllBooks();

            // Assert
            expect(bookRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe("getBookById", () => {
        it("should return a book with formatted score when it exists", async () => {
            // Arrange
            const bookId = 1;
            const mockBook: Book = {
                id: bookId,
                name: "Test Book",
                createdAt: new Date(),
                averageScore: 4.5,
                totalScore: 9,
                ratingsCount: 2,
            };

            bookRepository.findById = vi.fn().mockResolvedValue(mockBook);

            // Act
            const result = await bookService.getBookById(bookId);

            // Assert
            expect(bookRepository.findById).toHaveBeenCalledWith(bookId);
            expect(result).toEqual({
                id: bookId,
                name: "Test Book",
                score: "4.50",
            });
        });

        it("should return -1 as score when book has no ratings", async () => {
            // Arrange
            const bookId = 1;
            const mockBook: Book = {
                id: bookId,
                name: "Test Book with No Ratings",
                createdAt: new Date(),
                averageScore: 0,
                totalScore: 0,
                ratingsCount: 0,
            };

            bookRepository.findById = vi.fn().mockResolvedValue(mockBook);

            // Act
            const result = await bookService.getBookById(bookId);

            // Assert
            expect(bookRepository.findById).toHaveBeenCalledWith(bookId);
            expect(result).toEqual({
                id: bookId,
                name: "Test Book with No Ratings",
                score: -1,
            });
        });

        it("should throw AppError when book doesn't exist", async () => {
            // Arrange
            const bookId = 999;
            bookRepository.findById = vi.fn().mockResolvedValue(null);

            // Act & Assert
            await expect(bookService.getBookById(bookId)).rejects.toThrow(AppError);
            await expect(bookService.getBookById(bookId)).rejects.toThrow('Book not found');
            expect(bookRepository.findById).toHaveBeenCalledWith(bookId);
        });
    });
});
