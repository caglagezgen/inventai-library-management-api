
import { BookRepository } from '#repositories/book.repository.js';
import { BookCreateDto, BookDetailResponseDto, BookResponseDto } from '#models/book.model.js';
import { AppError } from '#utils/app-error.js';

export class BookService {
    constructor(private bookRepository: BookRepository) { }

    async createBook(bookData: BookCreateDto): Promise<BookResponseDto> {
        const book = await this.bookRepository.create(bookData);

        return {
            id: book.id,
            name: book.name,
        };
    }

    async getAllBooks(): Promise<BookResponseDto[]> {
        const books = await this.bookRepository.findAll();

        return books.map(book => ({
            id: book.id,
            name: book.name,
        }));
    }

    async getBookById(id: number): Promise<BookDetailResponseDto> {
        const book = await this.bookRepository.findById(id);

        if (!book) {
            throw new AppError('Book not found', 404);
        }

        const score = !book.averageScore ? -1 : book.averageScore.toFixed(2);

        return {
            id: book.id,
            name: book.name,
            score: score,
        };
    }
}