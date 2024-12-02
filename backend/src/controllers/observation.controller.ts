import { Request, Response } from "express";
import ObservationModel from "../models/observation.model";
import RoutesService from "../services/routes.service";
import { idSchema } from "../types/patient.schema";
import { baseObservationSchema } from "../types/observation.schema";
import { NotFoundError } from "../services/error.service";

// Lista las observaciones de un paciente
export const getObservations = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const { id: patientId } = req.params;

    const observations = await ObservationModel.findAllByPatient(+patientId);

    RoutesService.responseSuccess(res, observations);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

// Añade una nueva observación
export const addObservation = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    RoutesService.validationBody(req.body, baseObservationSchema);
    const { id: patientId } = req.params;
    const { code, value, date } = req.body;

    const observation = await ObservationModel.create({
      patientId: +patientId,
      code,
      value,
      date,
    });

    RoutesService.responseSuccess(res, observation, 201);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

// Actualiza una observación existente
export const updateObservation = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    RoutesService.validationBody(req.body, baseObservationSchema);
    const { id: patientId } = req.params;
    const { code, value, date } = req.body;

    const observation = await ObservationModel.findOneById(+patientId);
    if (!observation) throw new NotFoundError("Observación no encontrada");

    await ObservationModel.update({
      id: +patientId,
      code,
      value,
      date,
      patientId: observation.patientId,
    });

    RoutesService.responseSuccess(res, observation);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

// Elimina una observación
export const deleteObservation = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const { id } = req.params;

    const observation = await ObservationModel.findOneById(+id);
    if (!observation) throw new NotFoundError("Observación no encontrada");

    await ObservationModel.delete(+id);

    RoutesService.responseSuccess(res, observation);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};
