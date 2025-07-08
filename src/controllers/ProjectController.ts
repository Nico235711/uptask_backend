import { Request, Response } from 'express'
import Project from '../models/Project';

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    try {      
      const project = new Project(req.body)
      project.manager = req.user?.id
      await project.save()
      res.status(201).json("Projecto creado")
    } catch (error) {
      res.status(500).json({ error: "Hubo un error"})
    }
  };
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({})
      res.status(200).json({ data: projects })
    } catch (error) {
      res.status(500).json({ error: "Hubo un error"})
    }
  };
  static getProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const project = await Project.findById(id).populate("tasks")
      if (!project) {
        const error = new Error("Proyecto no encontrado")
        res.status(404).json({ error: error.message })
        return
      }
      res.status(200).json({ data: project })
    } catch (error) {
      res.status(500).json({ error: "Hubo un error"})
    }
  };
  static udpateProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const project = await Project.findById(id)
      if (!project) {
        const error = new Error("Proyecto no encontrado")
        res.status(404).json({ error: error.message })
        return
      }
      project.projectName = req.body.projectName
      project.clientName = req.body.clientName
      project.description = req.body.description
      await project.save()
      res.status(200).json("Proyecto actualizado")
    } catch (error) {
      res.status(500).json({ error: "Hubo un error"})
    }
  };
  static deleteProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const project = await Project.findById(id)
      if (!project) {
        const error = new Error("Proyecto no encontrado")
        res.status(404).json({ error: error.message })
        return
      }
      await project.deleteOne()
      res.status(200).json("Proyecto eliminado")
    } catch (error) {
      res.status(500).json({ error: "Hubo un error"})
    }
  };
}
