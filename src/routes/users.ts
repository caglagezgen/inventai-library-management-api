import express from "express";
import { UsersController } from "#controllers/users.js";

const router = express.Router();

router.post("/users", UsersController.createUser);
router.get("/users", UsersController.getUsers);
router.get("/users/:id", UsersController.getUserById);

// book borrow routes
router.post("/users/:userId/borrow/:bookId", UsersController.borrowBook);
router.post("/users/:userId/return/:bookId", UsersController.returnBook);

export default router;