import { Router } from "express";
import {
  getAllPatients,
  getPatientById,
} from "../controllers/patient.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {
  addObservation,
  getObservations,
} from "../controllers/observation.controller";

const router = Router();

// Rutas de pacientes
router.get("/", authenticate, getAllPatients); // Obtener una lista de todos los pacientes
router.get("/:id", authenticate, getPatientById); // Obtener los detalles de un paciente específico
router.get("/:id/observations", authenticate, getObservations); // Obtener todas las observaciones clínicas de un paciente (FHIR Observation)
router.post("/:id/observations", authenticate, addObservation); // Crear una nueva observación clínica para un paciente especíco.

export default router;
