/**
 * Project Router Module
 *
 * Handles all project-related HTTP routes and endpoints.
 * Provides routes for CRUD operations on projects including:
 * - Listing all projects
 * - Creating new projects
 * - Retrieving project details by ID
 * - Updating project status
 * - Deleting projects
 *
 * @module projectRouter
 * @requires express
 * @requires ../controller/project.controller
 */

/**
 * Express router instance for project routes
 * @type {Router}
 */

import { Router } from "express";
import ProjectController from "../controller/project.controller";

const projectRouter = Router();

/**
 * GET /
 * Retrieves a list of all projects
 * @route GET /
 * @returns {Object[]} Array of project objects
 */

projectRouter.get("/", ProjectController.listProjects); // list all projects

/**
 * POST /
 * Creates a new project
 * @route POST /
 * @param {Object} req.body - Project data
 * @returns {Object} Newly created project object
 */

projectRouter.post("/", ProjectController.createProject); //create projects

/**
 * GET /:id
 * Retrieves detailed information for a specific project by ID
 * @route GET /:id
 * @param {string} id - Project ID
 * @returns {Object} Project details object
 */

projectRouter.get("/:id", ProjectController.projectDetailsById); //get  projects by id

/**
 * PATCH /:id/status
 * Updates the status of a specific project
 * @route PATCH /:id/status
 * @param {string} id - Project ID
 * @param {Object} req.body - Status update data
 * @returns {Object} Updated project object
 */

projectRouter.patch("/:id/status", ProjectController.updateProjectStatusById); //update  projects by id

/**
 * DELETE /:id
 * Removes/deletes a specific project by ID
 * @route DELETE /:id
 * @param {string} id - Project ID
 * @returns {void|Object} Deletion confirmation or success response
 */
projectRouter.delete("/:id", ProjectController.removeProjectById); //delete  projects by id

export default projectRouter;
