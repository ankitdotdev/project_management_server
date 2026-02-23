/**
 * Express server application for Project Management API
 *
 * @module index
 * @description Initializes and starts the Express server with database connection,
 * middleware configuration, and API routes for project management.
 */

import express from "express";
import dotenv from "dotenv";
import projectRouter from "./modules/project/routes/project.router";
import Database from "./config/dbConfig";

/**
 * Load environment variables from .env file
 * @see https://www.npmjs.com/package/dotenv
 */
dotenv.config();

/**
 * Express application instance
 */
const app = express();

/**
 * Server port number from environment or default
 */
const PORT: number = Number(process.env.PORT) || 8000;

/**
 * Middleware to parse incoming JSON requests
 */
app.use(express.json());

/**
 * Project management API routes
 * @route /api/projects
 */
app.use("/api/projects", projectRouter);

/**
 * Health check endpoint for server status verification
 *
 * @route GET /health
 * @returns {Object} 200 - { status: "OK" }
 */
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

/**
 * Starts the Express server after establishing database connection.
 *
 * - Connects to MongoDB
 * - Starts server on configured port
 * - Exits process if database connection fails
 *
 * @async
 * @returns {Promise<void>}
 */
async function startServer(): Promise<void> {
  try {
    await Database.connect();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Initialize server
startServer();