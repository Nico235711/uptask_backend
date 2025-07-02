import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { AuthController } from "../controllers/AuthController";

const router = Router();

// ===== auth Route =====
router.post("/create-account",
  body("email").isEmail().withMessage("Formato de email no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
  body("password_confirmation")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Las contraseñas no coiciden"),
  body("name").notEmpty().withMessage("El nombre del usuario es obligatorio"),
  handleInputErrors,
  AuthController.createAccount
);

router.post("/confirm-account",
  body("token").notEmpty().withMessage("El token es obligatorio"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post("/login",
  body("email").isEmail().withMessage("Formato de email no válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  handleInputErrors,
  AuthController.login
);

router.post("/request-token",
  body("email").isEmail().withMessage("Formato de email no válido"),
  handleInputErrors,
  AuthController.requestConfirmationToken
);

router.post("/forgot-password",
  body("email").isEmail().withMessage("Formato de email no válido"),
  handleInputErrors,
  AuthController.forgotPassword
);

export default router;
