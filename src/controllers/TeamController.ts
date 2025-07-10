import { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamController {

  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body    
    const user = await User.findOne({ email }).select("id name email")
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" })
      return
    }
    res.json(user)
  }

  static addTeamMemberById = async (req: Request, res: Response) => {
    const { memberId } = req.body    
    const user = await User.findById(memberId).select("id")
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" })
      return
    }
    if (user.id.toString() === req.project.manager?.toString()) {
      res.status(400).json({ message: "El manager no puede ser colaborador" })
      return
    }
    if (req.project.team.includes(user.id)) {
      res.status(400).json({ message: "El usuario ya es parte del equipo" })
      return
    }
    req.project.team.push(user.id)
    await req.project.save()
    res.json("Usuario agregado al equipo")
  }

  static getTeamMembers = async (req: Request, res: Response) => {
    const project = await Project.findById(req.project.id).populate({
      path: "team",
      select: "name email"
    })
    res.json(project?.team)
  }

  static deleteTeamMemberById = async (req: Request, res: Response) => {
    const { memberId } = req.params
    const user = await User.findById(memberId)
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" })
      return
    }
    if (!req.project.team.includes(user.id)) {
      res.status(400).json({ message: "El usuario no existe" })
      return
    }
    req.project.team = req.project.team.filter(member => member?.toString() !== memberId)
    await req.project.save()
    res.json("Usuario eliminado del equipo")
  }
}
