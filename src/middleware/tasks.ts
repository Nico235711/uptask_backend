import { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export const taskExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskID } = req.params;
    const task = await Task.findById(taskID);
    if (!task) {
      const error = new Error("Tarea no encontrada");
      res.status(404).json({ error: error.message });
      return;
    }
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const taskBelongsToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskID } = req.params;
    const task = await Task.findById(taskID);
    if (req.task.project.toString() !== req.project.id) {
      const error = new Error("Acción no válida");
      res.status(401).json({ error: error.message });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};
