import prisma from "#prismaClient.js";
import { Request, Response } from "express";


// 1. Create a User
export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name } = req.body;

        const newUser = await prisma.user.create({
            data: { name },
            select: {
                id: true,
                name: true
            }
        });

        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// 2. Get All Users
export const getUsers = async (_req: Request, res: Response): Promise<any> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// 3. Get a Single User by ID
export const getUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = Number(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                borrowings: {
                    include: {
                        book: true, // Include book details
                    },
                },
            },
        });

        // If user does not exist
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // If the user exists but has no borrowing history, return empty arrays for `past` and `present`
        const past = user.borrowings
            .filter((borrow) => borrow.returnedAt !== null) // Filter books that have been returned
            .map((borrow) => ({
                name: borrow.book.name,
                userScore: borrow.score, // Include user-provided score
            }));

        const present = user.borrowings
            .filter((borrow) => borrow.returnedAt === null) // Filter currently borrowed books
            .map((borrow) => ({
                name: borrow.book.name,
            }));

        return res.status(200).json({
            id: user.id,
            name: user.name,
            books: {
                past: past.length > 0 ? past : [], // Safeguard: Ensure empty arrays are returned if no past borrowings exist
                present: present.length > 0 ? present : [], // Ensure empty arrays for no present borrowings
            },
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// 6. Borrow a Book
export const borrowBook = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = Number(req.params.userId);
        const bookId = Number(req.params.bookId);

        // Check for active borrowing
        const existingBorrowing = await prisma.borrowing.findFirst({
            where: {
                bookId,
                returnedAt: null,
            },
        });

        if (existingBorrowing) {
            return res.status(400).json({
                status: "error",
                message: "Someone already borrowed this book and hasn't returned it yet.",
            });
        }

        // Create a new borrowing record
        await prisma.borrowing.create({
            data: {
                userId,
                bookId,
            },
        });

        return res.status(204).json();
    } catch (error: any) {
        console.error("Error borrowing book:", error);

        if (error.code === "P2003") {
            // Use Prisma's error meta-data to provide a more specific error message
            const fieldName = error.meta?.field_name || "";

            if (fieldName.includes("userId")) {
                return res.status(404).json({
                    status: "error",
                    message: "User not found.",
                });
            } else if (fieldName.includes("bookId")) {
                return res.status(404).json({
                    status: "error",
                    message: "Book not found.",
                });
            }
        }

        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// 7. Return a Book
export const returnBook = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = Number(req.params.userId);
        const bookId = Number(req.params.bookId);
        const { score } = req.body; // Extract score from request body

        // Find active borrowing
        const borrowing = await prisma.borrowing.findFirst({
            where: { userId, bookId, returnedAt: null },
        });

        if (!borrowing) {
            return res.status(404).json({
                status: "error",
                message: "No active borrowing found for the specified user and book.",
            });
        }

        // Update borrowing record with return date and user-provided score
        await prisma.borrowing.update({
            where: { id: borrowing.id },
            data: {
                returnedAt: new Date(),
                score: Number(score),
            },
        });

        // Update the book's scoring statistics
        const book = await prisma.book.findUnique({ where: { id: bookId } });
        const newTotalScore = (book?.totalScore ?? 0) + Number(score)
        const newRatingsCount = (book?.ratingsCount ?? 0) + 1;
        const newAvarageScore = newTotalScore / newRatingsCount;

        await prisma.book.update({
            where: { id: bookId },
            data: {
                totalScore: newTotalScore,
                ratingsCount: newRatingsCount,
                averageScore: newAvarageScore,
            },
        });

        return res.status(204).json();
    } catch (error) {
        console.error("Error returning book:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Export the UsersController object
export const UsersController = {
    createUser,
    getUsers,
    getUserById,
    borrowBook,
    returnBook,
};