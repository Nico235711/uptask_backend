import { Request, Response } from 'express'
import Task from '../models/Task';

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body)
      task.project = req.project.id
      req.project.tasks.push(task)
      await Promise.allSettled([task.save(), req.project.save()])
      res.status(201).json("Tarea creada")
    } catch (error) {
      res.status(500).json({ error: "Hubo un error"})
    }
  };
  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate("project") // filtro y me traigo la info del proyecto
      res.status(200).json({ data: tasks })
    } catch (error) {
      res.status(500).json({ error: "Hubo un error"})
    }
  };
  static getTaskById = async (req: Request, res: Response) => {
    try {
      const { taskID } = req.params
      const task = await Task.findById(taskID)
      if (!task) {
        const error = new Error("Tarea no encontrada")
        res.status(404).json({ error: error.message })
        return
      }
      res.status(200).json({ data: task })
    } catch (error) {
      res.status(500).json({ error: "Hubo un error"})
    }
  };
  static udpateTaskById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const task = await Task.findById(id)
      if (!task) {
        const error = new Error("Tarea no encontrada")
        res.status(404).json({ error: error.message })
        return
      }
      task.taskName = req.body.taskName
      task.description = req.body.description
      await task.save()
      res.status(200).json("Tarea actualizada")
    } catch (error) {
      res.status(500).json({ error: "Hubo un error"})
    }
  };
  static deleteTaskById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const task = await Task.findById(id)
      if (!task) {
        const error = new Error("Tarea no encontrada")
        res.status(404).json({ error: error.message })
        return
      }
      await task.deleteOne()
      res.status(200).json("Tarea eliminada")
    } catch (error) {
      res.status(500).json({ error: "Hubo un error"})
    }
  };
}
