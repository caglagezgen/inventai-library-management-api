import express from 'express';
import { userController, borrowingController } from '#config/dependencies.js';
import { validate } from '#middlewares/validate.middleware.js';
import {
    createUserSchema,
    userIdParamSchema,
    borrowBookSchema,
    returnBookSchema
} from '#validations/user.validation.js';

const router = express.Router();

// User routes
router.post('/users', validate(createUserSchema), userController.createUser);
router.get('/users', userController.getUsers);
router.get('/users/:id', validate(userIdParamSchema), userController.getUserById);

// Borrowing routes
router.post(
    '/users/:userId/borrow/:bookId',
    validate(borrowBookSchema),
    borrowingController.borrowBook
);
router.post(
    '/users/:userId/return/:bookId',
    validate(returnBookSchema),
    borrowingController.returnBook
);

export default router;