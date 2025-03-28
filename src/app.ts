import express from "express";
import userRoutes from "#routes/user.routes.js";
import bookRoutes from "#routes/book.routes.js";
import { logger } from "#utils/logger.js";

// Create Express application
const app = express();

// Global middlewares
app.use(express.json());

// Routes
app.use(userRoutes);
app.use(bookRoutes);

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
    logger.error(err.stack);
    res.status(500).json({ status: "error", message: "Internal server error" });
});

export default app;
