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

export const taskExists = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const taskBelongsToProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.task.project.toString() !== req.project.id) {
      res.status(401).json({ message: "Acción no válida" });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};
