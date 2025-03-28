import app from "#app.js";

// Environment variables
const port = process.env.PORT ?? "3000";

// Create HTTP server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: Error) => {
  console.error("Unhandled Rejection:", reason);
  // Log the stack trace
  if (reason.stack) {
    console.error(reason.stack);
  }
  // Application should continue running despite unhandled promise rejections
});

// Handle uncaught exceptions (critical errors that should terminate the process)
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  // Log the stack trace
  if (error.stack) {
    console.error(error.stack);
  }
  // Attempt graceful shutdown
  gracefulShutdown(1);
});

// Graceful shutdown function
function gracefulShutdown(exitCode = 0): void {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed");

    // Close database connections here if needed
    // Example: await prisma.$disconnect()

    console.log("Shutdown complete");
    process.exit(exitCode);
  });

  // Force shutdown after 10 seconds if server doesn't close gracefully
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

// Handle termination signals
process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  gracefulShutdown();
});

process.on("SIGINT", () => {
  console.log("SIGINT received");
  gracefulShutdown();
});