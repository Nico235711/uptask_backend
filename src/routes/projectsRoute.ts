import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { TeamController } from "../controllers/TeamController";
import { authenticate, hasAuthorization } from "../middleware/auth";
import { projectExists } from "../middleware/projects";
import { taskBelongsToProject, taskExists } from "../middleware/tasks";
import { handleInputErrors } from "../middleware/validation";
import { NoteController } from "../controllers/NoteController";

const router = Router()

// ===== Projects Route =====
router.use(authenticate)

router.post("/",
  body("projectName")
    .notEmpty().withMessage("El nombre del proyecto no puede ir vacío"),
  body("clientName")
    .notEmpty().withMessage("El nombre del cliente no puede ir vacío"),
  body("description")
    .notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  ProjectController.createProject
)

router.get("/", ProjectController.getAllProjects)

router.param("projectId", projectExists)

router.get("/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  ProjectController.getProjectById
)

router.put("/:projectId",
  hasAuthorization,
  param("projectId").isMongoId().withMessage("ID no válido"),
  body("projectName")
    .notEmpty().withMessage("El nombre del proyecto no puede ir vacío"),
  body("clientName")
    .notEmpty().withMessage("El nombre del cliente no puede ir vacío"),
  body("description")
    .notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  ProjectController.udpateProjectById
)

router.delete("/:projectId",
  hasAuthorization,
  param("projectId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  ProjectController.deleteProjectById
)

// ===== Tasks Route =====
router.param("taskId", taskExists)
router.param("taskId", taskBelongsToProject)

router.post("/:projectId/tasks",
  hasAuthorization,
  body("taskName")
    .notEmpty().withMessage("El nombre de la tarea no puede ir vacío"),
  body("description")
    .notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  TaskController.createTask
)

router.post("/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("status")
    .isIn(["pending", "onHold", "inProgress", "underReview", "completed"])
    .withMessage("El estado de la tarea no es válido. Valores aceptados: pendiente, en espera, en progreso, en revisión, completada"),
  handleInputErrors,
  TaskController.updateTaskStatus
)

router.get("/:projectId/tasks", TaskController.getProjectTasks)
router.get("/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TaskController.getTaskById
)

router.put("/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("taskName")
    .notEmpty().withMessage("El nombre de la tarea no puede ir vacío"),
  body("description")
    .notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  TaskController.udpateTaskById
)

router.delete("/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TaskController.deleteTaskById
)

// ===== Team Route =====
router.post("/:projectId/team/find", 
  body("email").isEmail().toLowerCase().withMessage("Email no válido"), 
  handleInputErrors,
  TeamController.findMemberByEmail
)

router.post("/:projectId/team", 
  body("memberId").isMongoId().withMessage("Id no válido"), 
  handleInputErrors,
  TeamController.addTeamMemberById
)

router.get("/:projectId/team", TeamController.getTeamMembers)

router.delete("/:projectId/team/:memberId", 
  param("memberId").isMongoId().withMessage("Id no válido"), 
  handleInputErrors,
  TeamController.deleteTeamMemberById
)

// === Note routes ===
router.post("/:projectId/tasks/:taskId/notes", 
  body("content").notEmpty().withMessage("La nota no puede ir vacía"),handleInputErrors,
  NoteController.createNote
)

router.get("/:projectId/tasks/:taskId/notes", NoteController.getAllTaskNotes)

router.delete("/:projectId/tasks/:taskId/notes/:noteId",
  param("noteId").isMongoId().withMessage("Id no válido"), 
  handleInputErrors,
  NoteController.deleteNoteById
)

export default router