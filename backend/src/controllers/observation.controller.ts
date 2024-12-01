import { Request, Response } from "express";
import {
  create,
  deleted,
  findAllByPatient,
  findOneById,
  update,
} from "../models/observation.model";

// Lista las observaciones de un paciente
export const getObservations = async (req: Request, res: Response) => {
  const { id: patientId } = req.params;
  try {
    const observations = await findAllByPatient(+patientId);
    res.status(200).json(observations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las observaciones", error });
  }
};

// Añade una nueva observación
export const addObservation = async (req: Request, res: Response) => {
  const { id: patientId } = req.params;
  const { code, value, date } = req.body;
  try {
    const observation = await create({
      patientId: +patientId,
      code,
      value,
      date,
    });
    res.status(201).json(observation);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la observación", error });
  }
};

// Actualiza una observación existente
export const updateObservation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { code, value, date } = req.body;
  try {
    const observation = await findOneById(+id);
    if (!observation) {
      res.status(404).json({ message: "Observación no encontrada" });
      return;
    }
    await update({
      id: +id,
      code,
      value,
      date,
      patientId: observation.patientId,
    });
    res.status(200).json(observation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la observación", error });
  }
};

// Elimina una observación
export const deleteObservation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const observation = await findOneById(+id);
    if (!observation) {
      res.status(404).json({ message: "Observación no encontrada" });
      return;
    }
    await deleted(+id);
    res.status(200).json({ message: "Observación eliminada" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la observación", error });
  }
};
