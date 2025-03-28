import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserController } from "#controllers/user.controller.js";
import { UserService } from "#services/user.service.js";
import { Request, Response } from "express";
import { UserCreateDto } from "#models/user.model.js";

// Mock UserService
vi.mock("#services/user.service.js", () => {
    return {
        UserService: vi.fn(() => ({
            createUser: vi.fn(),
            getAllUsers: vi.fn(),
            getUserById: vi.fn(),
        })),
    };
});

describe("UserController", () => {
    let userController: UserController;
    let userService: UserService;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: any;
    let responseStatus: any;

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Create a new instance of UserService
        userService = new UserService({} as any);

        // Create a new instance of UserController with the mocked UserService
        userController = new UserController(userService);

        // Set up mock request and response
        responseJson = vi.fn().mockReturnThis();
        responseStatus = vi.fn().mockReturnValue({ json: responseJson });
        mockResponse = {
            status: responseStatus,
            json: responseJson,
        };
        mockRequest = {};
    });

    describe("createUser", () => {
        it("should create a new user and return 201 status", async () => {
            // Arrange
            const userData: UserCreateDto = { name: "Test User" };
            mockRequest.body = userData;
            const expectedUser = { id: 1, name: "Test User" };

            userService.createUser = vi.fn().mockResolvedValue(expectedUser);

            // Act
            await userController.createUser(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(userService.createUser).toHaveBeenCalledWith(userData);
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(expectedUser);
        });

        it("should handle errors and return 500 status for generic errors", async () => {
            // Arrange
            mockRequest.body = { name: "Test User" };
            const error = new Error("Something went wrong");
            userService.createUser = vi.fn().mockRejectedValue(error);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await userController.createUser(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(userService.createUser).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "Internal server error"
            });
        });
    });

    describe("getUsers", () => {
        it("should return all users with 200 status", async () => {
            // Arrange
            const mockUsers = [
                { id: 1, name: "User 1" },
                { id: 2, name: "User 2" },
            ];
            userService.getAllUsers = vi.fn().mockResolvedValue(mockUsers);

            // Act
            await userController.getUsers(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(userService.getAllUsers).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(mockUsers);
        });

        it("should handle errors and return 500 status", async () => {
            // Arrange
            const error = new Error("Database error");
            userService.getAllUsers = vi.fn().mockRejectedValue(error);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await userController.getUsers(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(userService.getAllUsers).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "Internal server error"
            });
        });
    });

    describe("getUserById", () => {
        it("should return a user by id with 200 status", async () => {
            // Arrange
            const userId = 1;
            mockRequest.params = { id: userId.toString() };
            const expectedUser = {
                id: userId,
                name: "Test User",
                books: {
                    past: [],
                    present: []
                }
            };
            userService.getUserById = vi.fn().mockResolvedValue(expectedUser);

            // Act
            await userController.getUserById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(userService.getUserById).toHaveBeenCalledWith(userId);
            expect(responseStatus).toHaveBeenCalledWith(200);
            expect(responseJson).toHaveBeenCalledWith(expectedUser);
        });

        it("should handle errors and return 500 status", async () => {
            // Arrange
            const userId = 1;
            mockRequest.params = { id: userId.toString() };
            const error = new Error("Database error");
            userService.getUserById = vi.fn().mockRejectedValue(error);

            // Add spy on console.error
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

            // Act
            await userController.getUserById(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(userService.getUserById).toHaveBeenCalledWith(userId);
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(responseStatus).toHaveBeenCalledWith(500);
            expect(responseJson).toHaveBeenCalledWith({
                status: "error",
                message: "Internal server error"
            });
        });
    });
});
