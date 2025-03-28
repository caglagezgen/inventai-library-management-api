import prisma from '#prismaClient.js';
import { UserRepository } from '#repositories/user.repository.js';
import { BookRepository } from '#repositories/book.repository.js';
import { BorrowingRepository } from '#repositories/borrowing.repository.js';
import { UserService } from '#services/user.service.js';
import { BookService } from '#services/book.service.js';
import { BorrowingService } from '#services/borrowing.service.js';
import { UserController } from '#controllers/user.controller.js';
import { BookController } from '#controllers/book.controller.js';
import { BorrowingController } from '#controllers/borrowing.controller.js';

// Repositories
const userRepository = new UserRepository(prisma);
const bookRepository = new BookRepository(prisma);
const borrowingRepository = new BorrowingRepository(prisma);

// Services
const userService = new UserService(userRepository);
const bookService = new BookService(bookRepository);
const borrowingService = new BorrowingService(
    borrowingRepository,
    bookRepository,
    userRepository
);

// Controllers
export const userController = new UserController(userService);
export const bookController = new BookController(bookService);
export const borrowingController = new BorrowingController(borrowingService);