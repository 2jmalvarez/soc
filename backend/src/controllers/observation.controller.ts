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

    const patientObservations = await PatientService.getObservations(patientId);

    RoutesService.responseSuccess(res, patientObservations);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};

// Añade una nueva observación
export const addObservation = async (req: Request, res: Response) => {
  try {
    const user_id = RoutesService.getUserId(req);

    RoutesService.validationParams(req.params, idSchema);
    const { id: patient_id } = req.params;

    RoutesService.validationBody(req.body, baseObservationSchema);
    const {
      code,
      value,
      date,
      status = "final",
      category,
      components,
    } = req.body;

    const observation = await ObservationModel.create({
      patient_id,
      user_id,
      code,
      value,
      date,
      status,
      category,
      components,
    });

    RoutesService.responseSuccess(res, { ...observation, components }, 201);
  } catch (error) {
    console.log({ error });

    RoutesService.responseError(res, error as any);
  }
};

// Añade una nueva observación
export const addObservationFhir = async (req: Request, res: Response) => {
  try {
    RoutesService.validationParams(req.params, idSchema);
    const { id: patient_id } = req.params;
    RoutesService.validationBody(req.body, baseObservationSchema);
    const {
      code,
      value,
      date,
      status = "final",
      category,
      components,
    } = req.body;
    const user_id = RoutesService.getUserId(req);
    console.log({
      code,
      value,
      date,
      status,
      category,
      components,
    });

    const observation = ObservationModel.create({
      patient_id,
      user_id,
      code,
      value,
      date,
      status,
      category,
      components,
    });

    // const observation = await ObservationModel.create({
    //   patientId: +patientId,
    //   code,
    //   value,
    //   date,
    //   user_id,
    // });

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
    const { code, value, date, status, category, components } = req.body;
    const user_id = RoutesService.getUserId(req);

    const observation = await ObservationModel.findOneById(observationId);
    if (!observation) throw new NotFoundError("Observación no encontrada");

    const editedObservation = await ObservationModel.update({
      id: observationId,
      code,
      value,
      date,
      patient_id: observation.patient_id,
      user_id,
      category: observation.category,
      status: observation.status,
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

    const observation = await ObservationModel.findOneById(id);
    if (!observation) throw new NotFoundError("Observación no encontrada");

    await ObservationModel.delete(id);

    RoutesService.responseSuccess(res, observation);
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};
