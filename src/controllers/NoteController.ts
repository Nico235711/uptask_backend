import { Request, Response } from 'express'
import Note from '../models/Note';

export class NoteController {
  static createNote = async (req: Request, res: Response) => {
    try {
      const note = new Note(req.body)
      note.createdBy = req.user.id
      note.task = req.task.id
      req.task.notes.push(note.id)
      await Promise.allSettled([note.save(), req.task.save()])
      res.status(201).json("Nota creada")
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" })
    }
  };

  static getAllTaskNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Note.find({ task: req.task.id })
      res.status(200).json({ data: notes })
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" })
    }
  };

  static deleteNoteById = async (req: Request, res: Response) => {
    try {
      const { noteId } = req.params
      const note = await Note.findById(noteId)
      if (!note) {
        res.status(404).json({ message: "Nota no encontrada" })
        return
      }
      if (note.createdBy.toString() !== req.user.id.toString()) {
        res.status(401).json({ message: "Solo el creador puede eliminar la nota" })
        return
      }
      req.task.notes = req.task.notes.filter(note => note.toString() !== noteId)
      await Promise.allSettled([note.deleteOne(), req.task.save()])
      res.status(200).json("Nota eliminada")
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" })
    }
  };
}
