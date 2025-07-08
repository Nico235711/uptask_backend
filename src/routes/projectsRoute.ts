import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { handleInputErrors } from "../middleware/validation";
import { projectExists } from "../middleware/projects";
import { taskBelongsToProject, taskExists } from "../middleware/tasks";
import { authenticate } from "../middleware/auth";

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

router.get("/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  ProjectController.getProjectById
)

router.put("/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  body("projectName")
    .notEmpty().withMessage("El nombre del proyecto no puede ir vacío"),
  body("clientName")
    .notEmpty().withMessage("El nombre del cliente no puede ir vacío"),
  body("description")
    .notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  ProjectController.udpateProjectById
)

router.delete("/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  ProjectController.deleteProjectById
)

// ===== Tasks Route =====
router.param("projectID", projectExists)
router.param("taskID", taskExists)
router.param("taskID", taskBelongsToProject)

router.post("/:projectID/tasks",
  body("taskName")
    .notEmpty().withMessage("El nombre de la tarea no puede ir vacío"),
  body("description")
    .notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  TaskController.createTask
)

router.post("/:projectID/tasks/:taskID/status",
  param("taskID").isMongoId().withMessage("ID no válido"),
  body("status")
    .isIn(["pending", "onHold", "inProgress", "underReview", "completed"])
    .withMessage("El estado de la tarea no es válido. Valores aceptados: pendiente, en espera, en progreso, en revisión, completada"),
  handleInputErrors,
  TaskController.updateTaskStatus
)

router.get("/:projectID/tasks", TaskController.getProjectTasks)
router.get("/:projectID/tasks/:taskID",
  param("taskID").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TaskController.getTaskById
)

router.put("/:projectID/tasks/:taskID",
  param("taskID").isMongoId().withMessage("ID no válido"),
  body("taskName")
    .notEmpty().withMessage("El nombre de la tarea no puede ir vacío"),
  body("description")
    .notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  TaskController.udpateTaskById
)

router.delete("/:projectID/tasks/:taskID",
  param("taskID").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TaskController.deleteTaskById
)

export default router