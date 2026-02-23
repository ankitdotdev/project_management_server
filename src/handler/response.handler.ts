/**
 * Sends a success response to the client.
 * @param res - The Express Response object
 * @param code - HTTP status code for the response
 * @param title - A short title describing the success
 * @param message - A detailed message about the success
 * @param data - Optional data payload to include in the response
 * @returns The Express Response object
 */

import { Response } from "express";

export const sendSuccess = (
  res: Response,
  code: number,
  title: string,
  message: string,
  data?: unknown,
) => {
  return res.status(code).json({ code, title, message, data });
};

/**
 * Sends an error response to the client.
 * @param res - The Express Response object
 * @param code - HTTP status code for the error (typically 4xx or 5xx)
 * @param title - A short title describing the error
 * @param message - A detailed error message
 * @returns The Express Response object
 */
export const sendError = (
  res: Response,
  code: number,
  title: string,
  message: string,
) => {
  return res.status(code).json({ code, title, message });
};
