import { Request, Response } from "express";
import PatientModel from "../models/patient.model";
import PatientService from "../services/patient.service";

// Lista todos los pacientes
export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await PatientModel.findAll();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pacientes", error });
  }
};

// Obtiene un paciente por ID
export const getPatientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const patient = await PatientModel.findById(+id);
    if (!patient) {
      res.status(404).json({ message: "Paciente no encontrado" });
      return;
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el paciente", error });
  }
};

// Agrega un nuevo paciente
export const createPatient = async (req: Request, res: Response) => {
  const { name, birth_date, gender, address } = req.body;
  try {
    const newPatient = await PatientService.create({
      name,
      birth_date,
      gender,
      address,
    });
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el paciente", error });
  }
};

// Elimina un paciente
export const deletePatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedPatient = await PatientModel.delete(+id);
    if (!deletedPatient) {
      res.status(404).json({ message: "Paciente no encontrado" });
      return;
    }
    res.status(200).json({ message: "Paciente eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el paciente", error });
  }
};

// Editar un paciente
export const updatePatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, birth_date, gender, address } = req.body;
  try {
    const newPatient = await PatientModel.update({
      name,
      birth_date,
      gender,
      address,
      id: +id,
    });
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ message: "Error al editar el paciente", error });
  }
};
