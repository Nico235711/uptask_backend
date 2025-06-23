import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { handleInputErrors } from "../middleware/validation";
import { projectExists } from "../middleware/projectExists";

const router = Router()

// ===== Projects Route =====
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

router.post("/:projectID/tasks", 
  body("taskName")
    .notEmpty().withMessage("El nombre de la tarea no puede ir vacío"),
  body("description")
    .notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  TaskController.createTask
)

router.get("/:projectID/tasks", TaskController.getProjectTasks)
router.get("/:projectID/tasks/:taskID", 
  TaskController.getTaskById)

export default router