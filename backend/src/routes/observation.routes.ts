import { Router } from "express";
import {
  // getObservations,
  // addObservation,
  updateObservation,
  deleteObservation,
} from "../controllers/observation.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Rutas para las observaciones
// router.get("/:patientId", authenticate, getObservations); // Lista las observaciones de un paciente
// router.post("/:patientId", authenticate, addObservation); // Añade una nueva observación
router.put("/:id", authenticate, updateObservation); // Actualiza una observación existente
router.delete("/:id", authenticate, deleteObservation); // Eliminar una observación clínica.

export default router;
