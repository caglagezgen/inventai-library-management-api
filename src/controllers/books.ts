import prisma from "#prismaClient.js";
import { Request, Response } from "express";

// 1. Create a Book
export const createBook = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name } = req.body;

        const newBook = await prisma.book.create({
            data: {
                name,
            },
            select: {
                id: true,
                name: true
            }
        });

        return res.status(201).json(newBook);
    } catch (error) {
        console.error("Error creating book:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// 2. Get All Books (For Browsing)
export const getBooks = async (_req: Request, res: Response): Promise<any> => {
    try {
        const books = await prisma.book.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// 3. Get a Book by ID (Show Score Information)
export const getBookById = async (req: Request, res: Response): Promise<any> => {
    try {
        const bookId = Number(req.params.id);

        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });

        // If the book does not exist
        if (!book) {
            return res.status(404).json({ status: "error", message: "Book not found" });
        }

        const avarageScore = !book.averageScore ? -1 : book.averageScore?.toFixed(2);

        // Respond with book information
        return res.status(200).json({
            id: book.id,
            name: book.name,
            score: avarageScore
        });
    } catch (error) {
        console.error("Error fetching book:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Export the BooksController object to connect with the routes
export const BooksController = {
    createBook,
    getBooks,
    getBookById,
};