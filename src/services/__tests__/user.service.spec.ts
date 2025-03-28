import { describe, it, expect, beforeEach, vi } from "vitest";
import { UserService } from "#services/user.service.js";
import { UserRepository } from "#repositories/user.repository.js";
import { User, UserCreateDto, UserWithBorrowings } from "#models/user.model.js";

// Mock UserRepository
vi.mock("#repositories/user.repository.js", () => {
    return {
        UserRepository: vi.fn(() => ({
            create: vi.fn(),
            findAll: vi.fn(),
            findByIdWithBorrowings: vi.fn(),
        })),
    };
});

describe("UserService", () => {
    let userService: UserService;
    let userRepository: UserRepository;

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Create a new instance of UserRepository
        userRepository = new UserRepository({} as any);

        // Create a new instance of UserService with the mocked UserRepository
        userService = new UserService(userRepository);
    });

    describe("createUser", () => {
        it("should create a new user", async () => {
            // Arrange
            const userData: UserCreateDto = { name: "Test User" };
            const expectedUser: User = { id: 1, name: "Test User" };

            userRepository.create = vi.fn().mockResolvedValue(expectedUser);

            // Act
            const result = await userService.createUser(userData);

            // Assert
            expect(userRepository.create).toHaveBeenCalledWith(userData);
            expect(result).toEqual(expectedUser);
        });
    });

    describe("getAllUsers", () => {
        it("should return all users", async () => {
            // Arrange
            const expectedUsers: User[] = [
                { id: 1, name: "User 1" },
                { id: 2, name: "User 2" },
            ];

            userRepository.findAll = vi.fn().mockResolvedValue(expectedUsers);

            // Act
            const result = await userService.getAllUsers();

            // Assert
            expect(userRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedUsers);
        });

        it("should return an empty array when no users exist", async () => {
            // Arrange
            userRepository.findAll = vi.fn().mockResolvedValue([]);

            // Act
            const result = await userService.getAllUsers();

            // Assert
            expect(userRepository.findAll).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe("getUserById", () => {
        it("should return user with borrowing history when user exists", async () => {
            // Arrange
            const userId = 1;
            const mockUserWithBorrowings: UserWithBorrowings = {
                id: userId,
                name: "Test User",
                borrowings: [
                    {
                        id: 1,
                        userId: userId,
                        bookId: 1,
                        borrowedAt: new Date(),
                        returnedAt: new Date(),
                        score: 5,
                        book: {
                            name: "Returned Book",
                        },
                    },
                    {
                        id: 2,
                        userId: userId,
                        bookId: 2,
                        borrowedAt: new Date(),
                        returnedAt: null,
                        score: null,
                        book: {
                            name: "Currently Borrowed Book",
                        },
                    },
                ],
            };

            userRepository.findByIdWithBorrowings = vi.fn().mockResolvedValue(mockUserWithBorrowings);

            // Act
            const result = await userService.getUserById(userId);

            // Assert
            expect(userRepository.findByIdWithBorrowings).toHaveBeenCalledWith(userId);
            expect(result).toEqual({
                id: userId,
                name: "Test User",
                books: {
                    past: [
                        {
                            name: "Returned Book",
                            userScore: 5,
                        },
                    ],
                    present: [
                        {
                            name: "Currently Borrowed Book",
                        },
                    ],
                },
            });
        });

        it("should return null when user doesn't exist", async () => {
            // Arrange
            const userId = 999;

            userRepository.findByIdWithBorrowings = vi.fn().mockResolvedValue(null);

            // Act
            const result = await userService.getUserById(userId);

            // Assert
            expect(userRepository.findByIdWithBorrowings).toHaveBeenCalledWith(userId);
            expect(result).toBeNull();
        });

        it("should handle user with no borrowings", async () => {
            // Arrange
            const userId = 1;
            const mockUserWithNoBorrowings: UserWithBorrowings = {
                id: userId,
                name: "Test User",
                borrowings: [],
            };

            userRepository.findByIdWithBorrowings = vi.fn().mockResolvedValue(mockUserWithNoBorrowings);

            // Act
            const result = await userService.getUserById(userId);

            // Assert
            expect(userRepository.findByIdWithBorrowings).toHaveBeenCalledWith(userId);
            expect(result).toEqual({
                id: userId,
                name: "Test User",
                books: {
                    past: [],
                    present: [],
                },
            });
        });
    });
});
