import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "#repositories/user.repository.js";
import { User, UserCreateDto, UserWithBorrowings } from "#models/user.model.js";

// Mock PrismaClient
vi.mock("@prisma/client", () => {
    const mockPrismaClient = {
        user: {
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
        },
    };

    return {
        PrismaClient: vi.fn(() => mockPrismaClient),
    };
});

describe("UserRepository", () => {
    let userRepository: UserRepository;
    let prisma: PrismaClient;

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Create a new instance of PrismaClient
        prisma = new PrismaClient();

        // Create a new instance of UserRepository with the mocked PrismaClient
        userRepository = new UserRepository(prisma);
    });

    describe("create", () => {
        it("should create a new user", async () => {
            // Arrange
            const userData: UserCreateDto = { name: "Test User" };
            const expectedUser: User = { id: 1, name: "Test User" };

            prisma.user.create = vi.fn().mockResolvedValue(expectedUser);

            // Act
            const result = await userRepository.create(userData);

            // Assert
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: userData,
                select: {
                    id: true,
                    name: true,
                },
            });
            expect(result).toEqual(expectedUser);
        });
    });

    describe("findAll", () => {
        it("should return all users", async () => {
            // Arrange
            const expectedUsers: User[] = [
                { id: 1, name: "User 1" },
                { id: 2, name: "User 2" },
            ];

            prisma.user.findMany = vi.fn().mockResolvedValue(expectedUsers);

            // Act
            const result = await userRepository.findAll();

            // Assert
            expect(prisma.user.findMany).toHaveBeenCalledWith({
                select: {
                    id: true,
                    name: true,
                },
            });
            expect(result).toEqual(expectedUsers);
        });

        it("should return an empty array when no users exist", async () => {
            // Arrange
            prisma.user.findMany = vi.fn().mockResolvedValue([]);

            // Act
            const result = await userRepository.findAll();

            // Assert
            expect(prisma.user.findMany).toHaveBeenCalledWith({
                select: {
                    id: true,
                    name: true,
                },
            });
            expect(result).toEqual([]);
        });
    });

    describe("findById", () => {
        it("should return a user when it exists", async () => {
            // Arrange
            const userId = 1;
            const expectedUser = { id: userId, name: "Test User", createdAt: new Date(), updatedAt: new Date() };

            prisma.user.findUnique = vi.fn().mockResolvedValue(expectedUser);

            // Act
            const result = await userRepository.findById(userId);

            // Assert
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId },
            });
            expect(result).toEqual(expectedUser);
        });

        it("should return null when user doesn't exist", async () => {
            // Arrange
            const userId = 999;

            prisma.user.findUnique = vi.fn().mockResolvedValue(null);

            // Act
            const result = await userRepository.findById(userId);

            // Assert
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId },
            });
            expect(result).toBeNull();
        });
    });

    describe("findByIdWithBorrowings", () => {
        it("should return a user with borrowings when it exists", async () => {
            // Arrange
            const userId = 1;
            const expectedUserWithBorrowings: UserWithBorrowings = {
                id: userId,
                name: "Test User",
                borrowings: [
                    {
                        id: 1,
                        userId: userId,
                        bookId: 1,
                        borrowedAt: new Date(),
                        returnedAt: null,
                        score: null,
                        book: {
                            name: "Book 1",
                        },
                    },
                ],
            };

            prisma.user.findUnique = vi.fn().mockResolvedValue(expectedUserWithBorrowings);

            // Act
            const result = await userRepository.findByIdWithBorrowings(userId);

            // Assert
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId },
                include: {
                    borrowings: {
                        include: {
                            book: true,
                        },
                    },
                },
            });
            expect(result).toEqual(expectedUserWithBorrowings);
        });

        it("should return null when user doesn't exist", async () => {
            // Arrange
            const userId = 999;

            prisma.user.findUnique = vi.fn().mockResolvedValue(null);

            // Act
            const result = await userRepository.findByIdWithBorrowings(userId);

            // Assert
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId },
                include: {
                    borrowings: {
                        include: {
                            book: true,
                        },
                    },
                },
            });
            expect(result).toBeNull();
        });
    });
});
