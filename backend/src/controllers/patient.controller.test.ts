import request from "supertest";
import express from "express";
import {
  getAllPatients,
  getPatientById,
  createPatient,
  deletePatient,
  updatePatient,
} from "./patient.controller";
import PatientModel from "../models/patient.model";
import PatientService from "../services/patient.service";

const app = express();
app.use(express.json());

app.get("/patients", getAllPatients);
app.get("/patients/:id", getPatientById);
app.post("/patients", createPatient);
app.delete("/patients/:id", deletePatient);
app.put("/patients/:id", updatePatient);

jest.mock("../models/patient.model");
jest.mock("../services/patient.service");

describe("Patient Controller", () => {
  describe("getAllPatients", () => {
    it("should return all patients", async () => {
      const patients = [{ id: 1, name: "John Doe" }];
      (PatientModel.findAll as jest.Mock).mockResolvedValue(patients);

      const response = await request(app).get("/patients");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(patients);
    });

    it("should handle errors", async () => {
      (PatientModel.findAll as jest.Mock).mockRejectedValue(new Error("Error"));

      const response = await request(app).get("/patients");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Error al obtener los pacientes",
        error: {},
      });
    });
  });

  describe("getPatientById", () => {
    it("should return a patient by ID", async () => {
      const patient = { id: 1, name: "John Doe" };
      (PatientModel.findById as jest.Mock).mockResolvedValue(patient);

      const response = await request(app).get("/patients/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(patient);
    });

    it("should return 404 if patient not found", async () => {
      (PatientModel.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/patients/1");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Paciente no encontrado" });
    });

    it("should handle errors", async () => {
      (PatientModel.findById as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      const response = await request(app).get("/patients/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Error al obtener el paciente",
        error: {},
      });
    });
  });

  describe("createPatient", () => {
    it("should create a new patient", async () => {
      const newPatient = {
        id: 1,
        name: "John Doe",
        birth_date: "1990-01-01",
        gender: "male",
        address: "123 Main St",
      };
      (PatientService.create as jest.Mock).mockResolvedValue(newPatient);

      const response = await request(app).post("/patients").send(newPatient);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newPatient);
    });

    it("should handle errors", async () => {
      (PatientService.create as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      const response = await request(app)
        .post("/patients")
        .send({ name: "John Doe" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Error al agregar el paciente",
        error: {},
      });
    });
  });

  describe("deletePatient", () => {
    it("should delete a patient", async () => {
      (PatientModel.delete as jest.Mock).mockResolvedValue(true);

      const response = await request(app).delete("/patients/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Paciente eliminado" });
    });

    it("should return 404 if patient not found", async () => {
      (PatientModel.delete as jest.Mock).mockResolvedValue(false);

      const response = await request(app).delete("/patients/1");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Paciente no encontrado" });
    });

    it("should handle errors", async () => {
      (PatientModel.delete as jest.Mock).mockRejectedValue(new Error("Error"));

      const response = await request(app).delete("/patients/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Error al eliminar el paciente",
        error: {},
      });
    });
  });

  describe("updatePatient", () => {
    it("should update a patient", async () => {
      const updatedPatient = {
        id: 1,
        name: "John Doe",
        birth_date: "1990-01-01",
        gender: "male",
        address: "123 Main St",
      };
      (PatientModel.update as jest.Mock).mockResolvedValue(updatedPatient);

      const response = await request(app)
        .put("/patients/1")
        .send(updatedPatient);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(updatedPatient);
    });

    it("should handle errors", async () => {
      (PatientModel.update as jest.Mock).mockRejectedValue(new Error("Error"));

      const response = await request(app)
        .put("/patients/1")
        .send({ name: "John Doe" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Error al editar el paciente",
        error: {},
      });
    });
  });
});
