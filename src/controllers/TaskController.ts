import { Request, Response } from "express";
import Task from "../models/Task";

const PENDING = "pending"

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;
      req.project.tasks.push(task);
      await Promise.allSettled([task.save(), req.project.save()]);
      res.status(201).json("Tarea creada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body
      req.task.status = status
      const data = {
        user: req.user?.id,
        status
      }
      req.task.completedBy.push(data)
      await req.task.save()
      res.status(201).json("Estado de la tarea actualizado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      ); // filtro y me traigo la info del proyecto
      res.status(200).json({ data: tasks });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.task.id)
        .populate({ path: "completedBy.user", select: "id name email" })
        .populate({ path: "notes", populate: { path: "createdBy", select: "id name email"} })
      res.status(200).json({ data: task });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static udpateTaskById = async (req: Request, res: Response) => {
    try {
      req.task.taskName = req.body.taskName;
      req.task.description = req.body.description;
      await req.task.save();
      res.status(200).json("Tarea actualizada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static deleteTaskById = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(task => task?.toString() !== req.task.id)
      await Promise.allSettled([req.task.deleteOne(), req.project.save()])
      res.status(200).json("Tarea eliminada");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
