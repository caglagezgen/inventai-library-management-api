import express from 'express';
import { bookController } from '#config/dependencies.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createBookSchema, bookIdParamSchema } from '#validations/book.validation.js';

const router = express.Router();

router.post('/books', validate(createBookSchema), bookController.createBook);
router.get('/books', bookController.getBooks);
router.get('/books/:id', validate(bookIdParamSchema), bookController.getBookById);

export default router;