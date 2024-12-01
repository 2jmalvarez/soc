import { Request, Response } from "express";
import { findAll, findById } from "../models/patient.model";

// Lista todos los pacientes
export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await findAll();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pacientes", error });
  }
};

// Obtiene un paciente por ID
export const getPatientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const patient = await findById(+id);
    if (!patient) {
      res.status(404).json({ message: "Paciente no encontrado" });
      return;
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el paciente", error });
  }
};
