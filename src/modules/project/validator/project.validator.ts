import ThrowError from "../../../middleware/project.middleware";
import { ProjectProps, STATUS_TYPE } from "../model/project.model";

class ProjectValidator {
  static createProject(data: ProjectProps): ProjectProps {
    const VALIDATION_STATUS_CODE = 400;
    const VALIDATION_TITLE = "VALIDATION_ERROR";

    const ALLOWED_STATUSES: ProjectProps["status"][] = [
      "active",
      "on_hold",
      "completed",
    ];

    const { clientName, name, description, status, startDate, endDate } = data;

    const validatedBody: ProjectProps = {} as ProjectProps;

    // -------------------------
    // Client Name Validation
    // -------------------------
    if (
      !clientName ||
      typeof clientName !== "string" ||
      clientName.trim() === ""
    ) {
      throw new ThrowError(
        VALIDATION_STATUS_CODE,
        VALIDATION_TITLE,
        "Client name is required",
      );
    }

    validatedBody.clientName = clientName.trim();

    // -------------------------
    // Project Name Validation
    // -------------------------
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw new ThrowError(
        VALIDATION_STATUS_CODE,
        VALIDATION_TITLE,
        "Project name is required",
      );
    }

    validatedBody.name = name.trim();

    // -------------------------
    // Description (Optional)
    // -------------------------
    if (description !== undefined) {
      if (typeof description !== "string" || description.trim() === "") {
        throw new ThrowError(
          VALIDATION_STATUS_CODE,
          VALIDATION_TITLE,
          "Description must be a non-empty string if provided",
        );
      }

      validatedBody.description = description.trim();
    }

    // -------------------------
    // Status Validation
    // -------------------------
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      throw new ThrowError(
        VALIDATION_STATUS_CODE,
        VALIDATION_TITLE,
        "Invalid or missing project status",
      );
    }

    validatedBody.status = status;

    // -------------------------
    // Start Date Validation
    // -------------------------
    if (!startDate) {
      throw new ThrowError(
        VALIDATION_STATUS_CODE,
        VALIDATION_TITLE,
        "Start date is required",
      );
    }

    const parsedStart = new Date(startDate);

    if (isNaN(parsedStart.getTime())) {
      throw new ThrowError(
        VALIDATION_STATUS_CODE,
        VALIDATION_TITLE,
        "Start date must be a valid ISO date",
      );
    }

    validatedBody.startDate = parsedStart;

    // -------------------------
    // End Date (Optional)
    // -------------------------
    if (endDate !== undefined) {
      const parsedEnd = new Date(endDate);

      if (isNaN(parsedEnd.getTime())) {
        throw new ThrowError(
          VALIDATION_STATUS_CODE,
          VALIDATION_TITLE,
          "End date must be a valid ISO date",
        );
      }

      if (parsedEnd < parsedStart) {
        throw new ThrowError(
          VALIDATION_STATUS_CODE,
          VALIDATION_TITLE,
          "End date cannot be before start date",
        );
      }

      validatedBody.endDate = parsedEnd;
    }

    validatedBody.createdAt = new Date();
    return validatedBody;
  }
}

export default ProjectValidator;
