import { describe, it, expect, beforeEach, vi } from "vitest";
import { BorrowingController } from "#controllers/borrowing.controller.js";
import { BorrowingService } from "#services/borrowing.service.js";
import { Request, Response } from "express";
import { ReturnBookDto } from "#models/borrowing.model.js";
import { AppError } from "#utils/app-error.js";

// Mock BorrowingService
vi.mock("#services/borrowing.service.js", () => {
    return {
        BorrowingService: vi.fn(() => ({
            borrowBook: vi.fn(),
            returnBook: vi.fn(),
        })),
    };
});

describe("BorrowingController", () => {
    let borrowingController: BorrowingController;
    let borrowingService: BorrowingService;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: any;
    let responseStatus: any;
    let responseSend: any;

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Create a new instance of BorrowingService
        borrowingService = new BorrowingService({} as any, {} as any, {} as any);

        // Create a new instance of BorrowingController with the mocked BorrowingService
        borrowingController = new BorrowingController(borrowingService);

        // Set up mock request and response
        responseSend = vi.fn().mockReturnThis();
        responseJson = vi.fn().mockReturnThis();
        responseStatus = vi.fn().mockReturnValue({
            json: responseJson,
            send: responseSend
        });
        mockResponse = {
            status: responseStatus,
            json: responseJson,
            send: responseSend
        };
        mockRequest = {};
    });

    describe("borrowBook", () => {
        it("should borrow a book and return 204 status", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            mockRequest.params = {
                userId: userId.toString(),
                bookId: bookId.toString()
            };

            borrowingService.borrowBook = vi.fn().mockResolvedValue(undefined);

            // Act
            await borrowingController.borrowBook(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(borrowingService.borrowBook).toHaveBeenCalledWith(userId, bookId);
            expect(responseStatus).toHaveBeenCalledWith(204);
            expect(responseSend).toHaveBeenCalled();
        });

        it("should handle AppError and return appropriate status code", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            mockRequest.params = {
                userId: userId.toString(),
                bookId: bookId.toString()
            };
            const appError = new AppError("Book already borrowed", 400);
            borrowingService.borrowBook = vi.fn().mockRejectedValue(appError);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await borrowingController.borrowBook(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(borrowingService.borrowBook).toHaveBeenCalledWith(userId, bookId);
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "Book already borrowed"
            });
        });

        it("should handle generic errors with 500 status", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            mockRequest.params = {
                userId: userId.toString(),
                bookId: bookId.toString()
            };
            const error = new Error("Something went wrong");
            borrowingService.borrowBook = vi.fn().mockRejectedValue(error);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await borrowingController.borrowBook(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(borrowingService.borrowBook).toHaveBeenCalledWith(userId, bookId);
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "Internal server error"
            });
        });
    });

    describe("returnBook", () => {
        it("should return a book with score and return 204 status", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            mockRequest.params = {
                userId: userId.toString(),
                bookId: bookId.toString()
            };
            const returnData: ReturnBookDto = { score: 5 };
            mockRequest.body = returnData;

            borrowingService.returnBook = vi.fn().mockResolvedValue(undefined);

            // Act
            await borrowingController.returnBook(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(borrowingService.returnBook).toHaveBeenCalledWith(userId, bookId, returnData);
            expect(responseStatus).toHaveBeenCalledWith(204);
            expect(responseSend).toHaveBeenCalled();
        });

        it("should handle AppError and return appropriate status code", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            mockRequest.params = {
                userId: userId.toString(),
                bookId: bookId.toString()
            };
            const returnData: ReturnBookDto = { score: 5 };
            mockRequest.body = returnData;

            const appError = new AppError("No active borrowing found", 404);
            borrowingService.returnBook = vi.fn().mockRejectedValue(appError);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await borrowingController.returnBook(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(borrowingService.returnBook).toHaveBeenCalledWith(userId, bookId, returnData);
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "No active borrowing found"
            });
        });

        it("should handle generic errors with 500 status", async () => {
            // Arrange
            const userId = 1;
            const bookId = 1;
            mockRequest.params = {
                userId: userId.toString(),
                bookId: bookId.toString()
            };
            const returnData: ReturnBookDto = { score: 5 };
            mockRequest.body = returnData;

            const error = new Error("Something went wrong");
            borrowingService.returnBook = vi.fn().mockRejectedValue(error);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await borrowingController.returnBook(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(borrowingService.returnBook).toHaveBeenCalledWith(userId, bookId, returnData);
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "Internal server error"
            });
        });
    });
});
