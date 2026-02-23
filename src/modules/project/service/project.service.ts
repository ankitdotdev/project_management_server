
import { ObjectId } from "mongodb";
import ThrowError from "../../../middleware/project.middleware";
import {
  ListProjectsParams,
  ProjectDetails,
  ProjectProps,
  STATUS_TYPE,
} from "../model/project.model";
import ProjectRepository from "../repository/project.repostiory";
import ProjectValidator from "../validator/project.validator";

class ProjectService {

  /**
 * Creates a new project with the provided data.
 * @param {ProjectProps} data - The project data to create
 * @returns {Promise<ProjectProps>} The created project object
 * @throws {ThrowError} Throws error if project creation fails
 */

  static async createProject(data: ProjectProps): Promise<ProjectProps> {
    const validatedBody = ProjectValidator.createProject(data);

    //result
    const result = await ProjectRepository.createProject(validatedBody);

    if (!result._id) {
      throw new ThrowError(500, "FAILURE", "Failed to create project");
    }

    return result;
  }

  
/**
 * Retrieves a paginated list of projects with optional filtering and sorting.
 * @param {ListProjectsParams} params - The parameters for listing projects
 * @param {number} params.page - The page number for pagination
 * @param {number} params.limit - The number of items per page
 * @param {string} [params.status] - Optional status filter
 * @param {string} [params.search] - Optional search query for name or clientName
 * @param {string} [params.sort] - Optional sort field with order (prefix with "-" for descending)
 * @returns {Promise<{data: ProjectProps[], pagination: {total: number, page: number, limit: number, totalPages: number}}>} Paginated project list with metadata
 * @throws {ThrowError} Throws error if sort field is invalid
 */



  static async listProjects({
    page,
    limit,
    status,
    search,
    sort,
  }: ListProjectsParams) {
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
      ];
    }

    const sortOption: any = {};
    const allowedSortFields = ["createdAt", "startDate"];

    if (sort) {
      const order = sort.startsWith("-") ? -1 : 1;
      const field = sort.replace("-", "");

      if (allowedSortFields.includes(field)) {
        sortOption[field] = order;
      } else {
        throw new ThrowError(
          400,
          "Invalid Sort Field",
          "Sorting not allowed on this field",
        );
      }
    } else {
      // Default sorting
      sortOption.createdAt = -1;
    }

    const { projects, total } = await ProjectRepository.listProjects(
      filter,
      sortOption,
      skip,
      limit,
    );

    return {
      data: projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  /**
 * Retrieves detailed information about a project by its ID.
 * @param {string} id - The project ID (MongoDB ObjectId)
 * @returns {Promise<ProjectDetails | null>} The project details or null if not found
 * @throws {ThrowError} Throws error if ID is invalid or project not found
 */


  static async projectDeatilsById(id: string): Promise<ProjectDetails | null> {
    if (!ObjectId.isValid(id)) {
      throw new ThrowError(400, "VALIDTION_ERROR", "Invalid id");
    }
    const data = await ProjectRepository.getProjectDataById(id);

    if (!data) {
      throw new ThrowError(404, "NOT_FOUND", "Project not found");
    }

    return data;
  }

  /**
 * Removes a project by its ID.
 * @param {string} id - The project ID (MongoDB ObjectId)
 * @returns {Promise<void>}
 * @throws {ThrowError} Throws error if ID is invalid, project not found, or deletion fails
 */

  static async removeProjectById(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new ThrowError(400, "VALIDTION_ERROR", "Invalid id");
    }

    const projectExists = await ProjectRepository.getProjectExistanceById(id);

    if (!projectExists) {
      throw new ThrowError(404, "NOT_FOUND", "Project not found");
    }

    const result = await ProjectRepository.deleteProjectById(id);

    if (!result) {
      throw new ThrowError(500, "FAILURE", "Failed to delete project");
    }

    return;
  }


  
/**
 * Updates the status of a project by its ID.
 * @param {string} id - The project ID (MongoDB ObjectId)
 * @param {STATUS_TYPE} status - The new status ("active" | "on_hold" | "completed")
 * @returns {Promise<void>}
 * @throws {ThrowError} Throws error if ID is invalid, status is invalid, project not found, or update fails
 */
  static async updateProjectStatusById(
    id: string,
    status: STATUS_TYPE,
  ): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new ThrowError(400, "VALIDTION_ERROR", "Invalid id");
    }

    const ALLOWED_STATUSES: STATUS_TYPE[] = ["active", "on_hold", "completed"];
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      throw new ThrowError(
        400,
        "VALIDATION_ERROR",
        "Invalid or missing project status",
      );
    }

    const projectExists = await ProjectRepository.getProjectExistanceById(id);

    if (!projectExists) {
      throw new ThrowError(404, "NOT_FOUND", "Project not found");
    }

    const result = await ProjectRepository.updateProjectStatusById(id, status);

    if (!result) {
      throw new ThrowError(
        500,
        "FAILURE",
        "Failed to update status of a  project",
      );
    }

    return;
  }
}

export default ProjectService;
