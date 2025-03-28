import express from "express";
import { BooksController } from "#controllers/books.js";

const router = express.Router();

router.post("/books", BooksController.createBook);
router.get("/books", BooksController.getBooks);
router.get("/books/:id", BooksController.getBookById);

export default router;