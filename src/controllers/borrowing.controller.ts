import { ReturnBookDto } from '#models/borrowing.model.js';
import { BorrowingService } from '#services/borrowing.service.js';
import { AppError } from '#utils/app-error.js';
import { Request, Response } from 'express';

export class BorrowingController {
    constructor(private borrowingService: BorrowingService) { }

    borrowBook = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = Number(req.params.userId);
            const bookId = Number(req.params.bookId);

            await this.borrowingService.borrowBook(userId, bookId);
            res.status(204).send();
        } catch (error) {
            this.handleError(error, res);
        }
    };

    returnBook = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = Number(req.params.userId);
            const bookId = Number(req.params.bookId);
            const returnData: ReturnBookDto = req.body;

            await this.borrowingService.returnBook(userId, bookId, returnData);
            res.status(204).send();
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        console.error('Error in BorrowingController:', error);

        if (error instanceof AppError) {
            res.status(error.statusCode).json({ status: 'error', message: error.message });
            return;
        }

        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}