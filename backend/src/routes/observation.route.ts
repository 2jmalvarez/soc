import { Router } from "express";
import {
  // getObservations,
  // addObservation,
  // updateObservation,
  deleteObservation,
  addObservationFhir,
  updateObservationFhir,
  getFhirObservation,
} from "../controllers/observation.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Rutas para las observaciones
router.get("/fhir/:id", authenticate, getFhirObservation); // Lista las observaciones de un paciente
router.post("/:id", authenticate, addObservationFhir); // Añade una nueva observación
router.put("/:id", authenticate, updateObservationFhir); // Actualiza una observación existente
router.delete("/:id", authenticate, deleteObservation); // Eliminar una observación clínica.

export default router;
