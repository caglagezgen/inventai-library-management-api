import express from "express";
import UsersRouter from "#routes/users.js";
import BooksRouter from "#routes/books.js";

// Create Express application
const app = express();

// Global middlewares
app.use(express.json());

// Routes
app.use(UsersRouter);
app.use(BooksRouter);

// Health check endpoint
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

// Not found handler
app.use((_req, res) => {
    res.status(404).json({ status: "error", message: "Resource not found" });
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ status: "error", message: "Internal server error" });
});

export default app;
