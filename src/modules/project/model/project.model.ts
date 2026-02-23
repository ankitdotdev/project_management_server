import { ObjectId } from "mongodb";

export type STATUS_TYPE = "active" | "on_hold" | "completed";




export interface ProjectProps {
  _id: string | ObjectId;
  name: string;
  clientName: string;
  status: STATUS_TYPE;
  description?: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectListItem {
  id: string;
  name: string;
  clientName: string;
  status: STATUS_TYPE;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
}

export interface ListProjectsParams {
  page: number;
  limit: number;
  status?: STATUS_TYPE;
  search?: string;
  sort?: string;
}


export interface ProjectDetails {
  id: string;
  name: string;
  clientName: string;
  status: STATUS_TYPE;
  description?: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
