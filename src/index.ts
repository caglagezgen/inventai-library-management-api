import app from "#app.js";

const port = process.env.PORT ?? "3000";

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: Error) => {
  console.error("Unhandled Rejection:", reason);
  if (reason.stack) {
    console.error(reason.stack);
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  if (error.stack) {
    console.error(error.stack);
  }
  gracefulShutdown(1);
});

function gracefulShutdown(exitCode = 0): void {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed");
    console.log("Shutdown complete");
    process.exit(exitCode);
  });

  // Force shutdown after 10 seconds
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