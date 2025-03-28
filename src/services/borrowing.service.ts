import { ReturnBookDto } from "#models/borrowing.model.js";
import { BookRepository } from "#repositories/book.repository.js";
import { BorrowingRepository } from "#repositories/borrowing.repository.js";
import { UserRepository } from "#repositories/user.repository.js";
import { AppError } from "#utils/app-error.js";

export class BorrowingService {
    constructor(
        private borrowingRepository: BorrowingRepository,
        private bookRepository: BookRepository,
        private userRepository: UserRepository
    ) { }

    async borrowBook(userId: number, bookId: number): Promise<void> {
        // Check if book is already borrowed
        const existingBorrowing = await this.borrowingRepository.findActiveBorrowing(bookId);
        if (existingBorrowing) {
            throw new AppError('Someone already borrowed this book and hasn\'t returned it yet.', 400);
        }

        // Check if user and book exist
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError('User not found.', 404);
        }

        const book = await this.bookRepository.findById(bookId);
        if (!book) {
            throw new AppError('Book not found.', 404);
        }

        // Create borrowing record
        await this.borrowingRepository.create(userId, bookId);
    }

    async returnBook(userId: number, bookId: number, returnData: ReturnBookDto): Promise<void> {
        // Find active borrowing
        const borrowing = await this.borrowingRepository.findUserActiveBorrowing(userId, bookId);
        if (!borrowing) {
            throw new AppError('No active borrowing found for the specified user and book.', 404);
        }

        // Update borrowing record
        await this.borrowingRepository.update(borrowing.id, {
            returnedAt: new Date(),
            score: returnData.score,
        });

        // Update book's score
        const book = await this.bookRepository.findById(bookId);
        if (!book) {
            throw new AppError('Book not found.', 404);
        }

        const newTotalScore = (book.totalScore || 0) + returnData.score;
        const newRatingsCount = (book.ratingsCount || 0) + 1;
        const newAverageScore = newTotalScore / newRatingsCount;

        await this.bookRepository.updateScore(
            bookId,
            newTotalScore,
            newRatingsCount,
            newAverageScore
        );
    }
}