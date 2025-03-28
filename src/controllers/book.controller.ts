import { Request, Response } from 'express';
import { BookService } from '#services/book.service.js';
import { BookCreateDto } from '#models/book.model.js';
import { AppError } from '#utils/app-error.js';

export class BookController {
    constructor(private bookService: BookService) { }

    createBook = async (req: Request, res: Response): Promise<void> => {
        try {
            const bookData: BookCreateDto = req.body;
            const newBook = await this.bookService.createBook(bookData);
            res.status(201).json(newBook);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    getBooks = async (_req: Request, res: Response): Promise<void> => {
        try {
            const books = await this.bookService.getAllBooks();
            res.status(200).json(books);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    getBookById = async (req: Request, res: Response): Promise<void> => {
        try {
            const bookId = Number(req.params.id);
            const book = await this.bookService.getBookById(bookId);
            res.status(200).json(book);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        console.error('Error in BookController:', error);

        if (error instanceof AppError) {
            res.status(error.statusCode).json({ status: 'error', message: error.message });
            return;
        }

        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}