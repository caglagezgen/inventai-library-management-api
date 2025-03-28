import { describe, it, expect, beforeEach, vi } from "vitest";
import { BookController } from "#controllers/book.controller.js";
import { BookService } from "#services/book.service.js";
import { Request, Response } from "express";
import { BookCreateDto } from "#models/book.model.js";
import { AppError } from "#utils/app-error.js";

// Mock BookService
vi.mock("#services/book.service.js", () => {
    return {
        BookService: vi.fn(() => ({
            createBook: vi.fn(),
            getAllBooks: vi.fn(),
            getBookById: vi.fn(),
        })),
    };
});

describe("BookController", () => {
    let bookController: BookController;
    let bookService: BookService;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: any;
    let responseStatus: any;

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Create a new instance of BookService
        bookService = new BookService({} as any);

        // Create a new instance of BookController with the mocked BookService
        bookController = new BookController(bookService);

        // Set up mock request and response
        responseJson = vi.fn().mockReturnThis();
        responseStatus = vi.fn().mockReturnValue({ json: responseJson });
        mockResponse = {
            status: responseStatus,
            json: responseJson,
        };
        mockRequest = {};
    });

    describe("createBook", () => {
        it("should create a new book and return 201 status", async () => {
            // Arrange
            const bookData: BookCreateDto = { name: "Test Book" };
            mockRequest.body = bookData;
            const expectedBook = { id: 1, name: "Test Book" };

            bookService.createBook = vi.fn().mockResolvedValue(expectedBook);

            // Act
            await bookController.createBook(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(bookService.createBook).toHaveBeenCalledWith(bookData);
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(expectedBook);
        });

        it("should handle errors and return 500 status for generic errors", async () => {
            // Arrange
            mockRequest.body = { name: "Test Book" };
            const error = new Error("Something went wrong");
            bookService.createBook = vi.fn().mockRejectedValue(error);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await bookController.createBook(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(bookService.createBook).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "Internal server error"
            });
        });

        it("should handle AppError and return the appropriate status code", async () => {
            // Arrange
            mockRequest.body = { name: "Test Book" };
            const appError = new AppError("Book name already exists", 400);
            bookService.createBook = vi.fn().mockRejectedValue(appError);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await bookController.createBook(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(bookService.createBook).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "Book name already exists"
            });
        });
    });

    describe("getBooks", () => {
        it("should return all books with 200 status", async () => {
            // Arrange
            const mockBooks = [
                { id: 1, name: "Book 1" },
                { id: 2, name: "Book 2" },
            ];
            bookService.getAllBooks = vi.fn().mockResolvedValue(mockBooks);

            // Act
            await bookController.getBooks(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(bookService.getAllBooks).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(mockBooks);
        });

        it("should handle errors and return 500 status", async () => {
            // Arrange
            const error = new Error("Database error");
            bookService.getAllBooks = vi.fn().mockRejectedValue(error);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await bookController.getBooks(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(bookService.getAllBooks).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "Internal server error"
            });
        });
    });

    describe("getBookById", () => {
        it("should return a book by id with 200 status", async () => {
            // Arrange
            const bookId = 1;
            mockRequest.params = { id: bookId.toString() };
            const expectedBook = {
                id: bookId,
                name: "Test Book",
                score: "4.50"
            };
            bookService.getBookById = vi.fn().mockResolvedValue(expectedBook);

            // Act
            await bookController.getBookById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(bookService.getBookById).toHaveBeenCalledWith(bookId);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(expectedBook);
        });

        it("should handle AppError when book not found", async () => {
            // Arrange
            const bookId = 999;
            mockRequest.params = { id: bookId.toString() };
            const appError = new AppError("Book not found", 404);
            bookService.getBookById = vi.fn().mockRejectedValue(appError);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await bookController.getBookById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(bookService.getBookById).toHaveBeenCalledWith(bookId);
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "Book not found"
            });
        });

        it("should handle generic errors and return 500 status", async () => {
            // Arrange
            const bookId = 1;
            mockRequest.params = { id: bookId.toString() };
            const error = new Error("Database error");
            bookService.getBookById = vi.fn().mockRejectedValue(error);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await bookController.getBookById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(bookService.getBookById).toHaveBeenCalledWith(bookId);
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "Internal server error"
            });
        });
    });
});
