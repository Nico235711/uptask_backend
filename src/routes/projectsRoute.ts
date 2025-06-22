import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

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

export default router