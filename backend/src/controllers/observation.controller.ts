import { Request, Response } from "express";
import ObservationModel from "../models/observation.model";
import RoutesService from "../services/routes.service";
import { idSchema } from "../types/patient.schema";
import { baseObservationSchema } from "../types/observation.schema";
import { NotFoundError } from "../services/error.service";
import PatientService from "../services/patient.service";

// Lista las observaciones de un paciente
export const getObservations = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const { id: patientId } = req.params;

    const patientObservations = await PatientService.getObservations(
      +patientId
    );

    RoutesService.responseSuccess(res, patientObservations);
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
    const { observation_code, value, date } = req.body;
    const user_id = RoutesService.getUserId(req);

    const observation = await ObservationModel.create({
      patientId: +patientId,
      observation_code,
      value,
      date,
      user_id,
    });

    RoutesService.responseSuccess(res, observation, 201);
  } catch (error) {
    console.log({ error });

    RoutesService.responseError(res, error as any);
  }
};

// Actualiza una observación existente
export const updateObservation = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    RoutesService.validationBody(req.body, baseObservationSchema);
    const { id: observationId } = req.params;
    const { observation_code, value, date } = req.body;
    const user_id = RoutesService.getUserId(req);

    const observation = await ObservationModel.findOneById(+observationId);
    if (!observation) throw new NotFoundError("Observación no encontrada");

    const editedObservation = await ObservationModel.update({
      id: +observationId,
      observation_code,
      value,
      date,
      patientId: observation.patientId,
      user_id,
    });

    RoutesService.responseSuccess(res, editedObservation);
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
