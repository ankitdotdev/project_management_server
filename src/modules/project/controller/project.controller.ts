/**
 * ProjectController - Handles all project-related HTTP requests
 *
 * This controller class manages CRUD operations and status updates for projects.
 * It handles request validation, delegates business logic to ProjectService,
 * and formats responses using the response handler utility.
 *
 * @class ProjectController
 */

/**
 * Creates a new project
 *
 * @static
 * @async
 * @param {Request} req - Express request object containing project data in body
 * @param {Response} res - Express response object
 * @returns {Promise<any>} JSON response with status 201 on success or appropriate error status
 * @throws {ThrowError} Application-specific errors
 * @throws {Error} Unexpected runtime errors
 *
 * @example
 * POST /api/projects
 * Body: { name: "Project A", description: "..." }
 */

import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../../handler/response.handler";
import ThrowError from "../../../middleware/project.middleware";
import ProjectService from "../service/project.service";
import { STATUS_TYPE } from "../model/project.model";

class ProjectController {
  static async createProject(req: Request, res: Response): Promise<any> {
    try {
      const data = await ProjectService.createProject(req.body);

      return sendSuccess(
        res,
        201,
        "SUCCESS",
        "Project created successfully",
        data,
      );
    } catch (error) {
      // Handle known errors thrown within the application
      if (error instanceof ThrowError) {
        return sendError(res, error.code, error.title, error.message);
      } else if (error instanceof Error) {
        // Handle unexpected errors

        return sendError(res, 500, "Internal Server Error", error.message);
      } else {
        // Handle unknown errors
        return sendError(
          res,
          500,
          "Internal Server Error",
          "An unknown error occurred",
        );
      }
    }
  }

  /**
   * Retrieves a paginated list of projects with filtering and sorting
   *
   * @static
   * @async
   * @param {Request} req - Express request object with query parameters
   * @param {number} [req.query.page=1] - Page number for pagination
   * @param {number} [req.query.limit=10] - Number of records per page
   * @param {STATUS_TYPE} [req.query.status] - Optional project status filter
   * @param {string} [req.query.search] - Optional search term
   * @param {string} [req.query.sort] - Optional sort field
   * @param {Response} res - Express response object
   * @returns {Promise<any>} JSON response with paginated projects data
   * @throws {ThrowError} Application-specific errors
   * @throws {Error} Unexpected runtime errors
   *
   * @example
   * GET /api/projects?page=1&limit=10&status=active&search=name&sort=createdAt
   */

  static async listProjects(req: Request, res: Response): Promise<any> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as STATUS_TYPE | undefined;
      const search = req.query.search as string | undefined;
      const sort = req.query.sort as string | undefined;

      const data = await ProjectService.listProjects({
        page,
        limit,
        status,
        search,
        sort,
      });

      return sendSuccess(
        res,
        200,
        "Projects List",
        "Data fetched successfully",
        data,
      );
    } catch (error) {
      if (error instanceof ThrowError) {
        return sendError(res, error.code, error.title, error.message);
      }

      return sendError(
        res,
        500,
        "Internal Server Error",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  /**
   * Retrieves detailed information of a project by ID
   *
   * @static
   * @async
   * @param {Request} req - Express request object with project ID in params
   * @param {string} req.params.id - The project ID (required)
   * @param {Response} res - Express response object
   * @returns {Promise<any>} JSON response with project details
   * @throws {ThrowError} Application-specific errors
   * @throws {Error} Unexpected runtime errors
   *
   * @example
   * GET /api/projects/:id
   */

  static async projectDetailsById(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id as string;

      if (!id) {
        return sendError(res, 400, "VALIDATION_ERROR", "Id is required");
      }

      const data = await ProjectService.projectDeatilsById(id);

      return sendSuccess(
        res,
        200,
        "Project Details",
        "Data fetched succesfully",
        data,
      );
    } catch (error) {
      // Handle known errors thrown within the application
      if (error instanceof ThrowError) {
        return sendError(res, error.code, error.title, error.message);
      } else if (error instanceof Error) {
        // Handle unexpected errors

        return sendError(res, 500, "Internal Server Error", error.message);
      } else {
        // Handle unknown errors
        return sendError(
          res,
          500,
          "Internal Server Error",
          "An unknown error occurred",
        );
      }
    }
  }

  /**
   * Deletes a project by ID
   *
   * @static
   * @async
   * @param {Request} req - Express request object with project ID in params
   * @param {string} req.params.id - The project ID to delete (required)
   * @param {Response} res - Express response object
   * @returns {Promise<any>} JSON response with deletion confirmation
   * @throws {ThrowError} Application-specific errors
   * @throws {Error} Unexpected runtime errors
   *
   * @example
   * DELETE /api/projects/:id
   */

  static async removeProjectById(req: Request, res: Response): Promise<any> {
    try {
      const id = req.params.id as string;

      if (!id) {
        return sendError(res, 400, "VALIDATION_ERROR", "Id is required");
      }

      const data = await ProjectService.removeProjectById(id);

      return sendSuccess(
        res,
        200,
        "Project Deletion Process",
        "Project deleted successfully",
        data,
      );
    } catch (error) {
      // Handle known errors thrown within the application
      if (error instanceof ThrowError) {
        return sendError(res, error.code, error.title, error.message);
      } else if (error instanceof Error) {
        // Handle unexpected errors

        return sendError(res, 500, "Internal Server Error", error.message);
      } else {
        // Handle unknown errors
        return sendError(
          res,
          500,
          "Internal Server Error",
          "An unknown error occurred",
        );
      }
    }
  }

  /**
   * Updates the status of a project by ID
   *
   * @static
   * @async
   * @param {Request} req - Express request object with project ID and status data
   * @param {string} req.params.id - The project ID (required)
   * @param {STATUS_TYPE} req.body.status - The new project status (required)
   * @param {Response} res - Express response object
   * @returns {Promise<any>} JSON response with updated project data
   * @throws {ThrowError} Application-specific errors
   * @throws {Error} Unexpected runtime errors
   *
   * @example
   * PATCH /api/projects/:id/status
   * Body: { status: "completed" }
   */

  static async updateProjectStatusById(
    req: Request,
    res: Response,
  ): Promise<any> {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      if (!id) {
        return sendError(res, 400, "VALIDATION_ERROR", "Id is required");
      }

      const data = await ProjectService.updateProjectStatusById(
        id,
        status as STATUS_TYPE,
      );

      return sendSuccess(
        res,
        200,
        "Project Status Update",
        "Project status updated successfully",
        data,
      );
    } catch (error) {
      // Handle known errors thrown within the application
      if (error instanceof ThrowError) {
        return sendError(res, error.code, error.title, error.message);
      } else if (error instanceof Error) {
        // Handle unexpected errors

        return sendError(res, 500, "Internal Server Error", error.message);
      } else {
        // Handle unknown errors
        return sendError(
          res,
          500,
          "Internal Server Error",
          "An unknown error occurred",
        );
      }
    }
  }
}

export default ProjectController;
