/**
 * ProjectRepository class handles all database operations for project management.
 *
 * This repository provides methods to create, read, update, and delete project documents
 * from the MongoDB database. It serves as the data access layer for project-related operations.
 */

import { ObjectId } from "mongodb";
import {
  ProjectDetails,
  ProjectListItem,
  ProjectProps,
  STATUS_TYPE,
} from "../model/project.model";
import Database from "../../../config/dbConfig";

class ProjectRepository {
  static projectCollectionName = "projects";
  /**
   * Creates a new project in the database.
   *
   * @param data - The project data to be created
   * @returns Promise containing the created project with its generated MongoDB ID
   * @throws Will throw if database insertion fails
   *
   * @example
   * const newProject = await ProjectRepository.createProject({
   *   name: "Website Redesign",
   *   clientName: "Acme Corp",
   *   status: "active",
   *   startDate: new Date(),
   *   endDate: new Date(),
   *   description: "Redesign company website",
   *   createdAt: new Date(),
   *   updatedAt: new Date()
   * });
   */

  static async createProject(data: ProjectProps): Promise<ProjectProps> {
    const collection = Database.getDB().collection<ProjectProps>(
      this.projectCollectionName,
    );
    const result = await collection.insertOne(data);

    return {
      ...data,
      _id: result.insertedId.toString(),
    };
  }
  /**
   * Retrieves a paginated and sorted list of projects.
   *
   * @param filter - MongoDB filter object to query projects (e.g., { status: "active" })
   * @param sortOption - MongoDB sort specification (e.g., { createdAt: -1 })
   * @param skip - Number of documents to skip for pagination
   * @param limit - Maximum number of documents to return
   * @returns Promise containing an object with projects array and total count of matching documents
   * @throws Will throw if database query fails
   *
   * @example
   * const result = await ProjectRepository.listProjects(
   *   { status: "active" },
   *   { createdAt: -1 },
   *   0,
   *   10
   * );
   */

  static async listProjects(
    filter: any,
    sortOption: any,
    skip: number,
    limit: number,
  ): Promise<{ projects: ProjectListItem[]; total: number }> {
    const collection = Database.getDB().collection<ProjectProps>(
      this.projectCollectionName,
    );

    // Fetch paginated data
    const projectsRaw = await collection
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Count total documents
    const total = await collection.countDocuments(filter);

    // Map to table-friendly format
    const projects: ProjectListItem[] = projectsRaw.map((project) => ({
      id: project._id.toString(),
      name: project.name,
      clientName: project.clientName,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      createdAt: project.createdAt,
    }));

    return { projects, total };
  }

  /**
   * Retrieves detailed information about a specific project by its ID.
   *
   * @param id - The MongoDB ObjectId of the project as a string
   * @returns Promise containing the complete project details or null if not found
   * @throws Will throw if the provided ID is invalid or database query fails
   *
   * @example
   * const projectDetails = await ProjectRepository.getProjectDataById("507f1f77bcf86cd799439011");
   */

  static async getProjectDataById(id: string): Promise<ProjectDetails | null> {
    const collection = Database.getDB().collection<ProjectProps>(
      this.projectCollectionName,
    );

    const data = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!data) return null;

    return {
      id: data._id.toString(),
      name: data.name,
      clientName: data.clientName,
      status: data.status,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  /**
   * Checks if a project exists in the database by its ID.
   *
   * Validates the provided ID as a valid MongoDB ObjectId before querying the database.
   * This is more efficient than fetching the entire document when only checking existence.
   *
   * @param id - The MongoDB ObjectId of the project as a string
   * @returns Promise<boolean> - True if project exists, false otherwise
   *
   * @example
   * const exists = await ProjectRepository.getProjectExistanceById("507f1f77bcf86cd799439011");
   * if (exists) {
   *   // Project found
   * }
   */

  static async getProjectExistanceById(id: string): Promise<boolean> {
    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return false;
    }

    // Get the projects collection from the database
    const collection = Database.getDB().collection(this.projectCollectionName);

    // Count documents matching the ID with a limit of 1 for efficiency
    const exists = await collection.countDocuments(
      { _id: new ObjectId(id) },
      { limit: 1 },
    );

    // Return true if at least one document exists
    return exists > 0;
  }

  /**
   * Deletes a project from the database by its ID.
   *
   * @param id - The MongoDB ObjectId of the project to delete as a string
   * @returns Promise<boolean> - True if project was successfully deleted, false otherwise
   * @throws Will throw if the provided ID is invalid or database operation fails
   *
   * @example
   * const deleted = await ProjectRepository.deleteProjectById("507f1f77bcf86cd799439011");
   */

  static async deleteProjectById(id: string): Promise<boolean> {
    const collection = Database.getDB().collection(this.projectCollectionName);

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    return result.deletedCount === 1;
  }

  /**
   * Updates the status of a project by its ID.
   *
   * This method updates the project's status and automatically sets the updatedAt timestamp
   * to the current date and time.
   *
   * @param id - The MongoDB ObjectId of the project to update as a string
   * @param status - The new status value for the project
   * @returns Promise<boolean> - True if project was successfully updated, false otherwise
   * @throws Will throw if the provided ID is invalid or database operation fails
   *
   * @example
   * const updated = await ProjectRepository.updateProjectStatusById("507f1f77bcf86cd799439011", "completed");
   */
  static async updateProjectStatusById(
    id: string,
    status: STATUS_TYPE,
  ): Promise<boolean> {
    const collection = Database.getDB().collection(this.projectCollectionName);

    const result = await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    );

    return result.modifiedCount === 1;
  }
}

export default ProjectRepository;
