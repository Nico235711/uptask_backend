import { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project";

declare global {
  namespace Express {
    interface Request {
      project: IProject;
    }
  }
}

export const projectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectID } = req.params;
    const project = await Project.findById(projectID);
    if (!project) {
      const error = new Error("Proyecto no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }
    req.project = project
    next()
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};
