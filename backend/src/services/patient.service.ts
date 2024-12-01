import PatientModel, { Patient } from "../models/patient.model";

// Crear paciente

const PatientService = {
  async create(patient: Omit<Patient, "id">) {
    try {
      const patients = await PatientModel.findAll(); // seria mas eficiente tener un model y hacer la consulta directamente en la DB
      // se toma como mpi que el paciente existe si tiene el mismo nombre, fecha de nacimiento y genero
      const patientExist = patients.some(
        (p) =>
          p.name === patient.name &&
          p.birth_date === patient.birth_date &&
          p.gender === patient.gender
      );

      if (patientExist) {
        throw new Error("El paciente ya existe");
      }

      return await PatientModel.create(patient);
    } catch (error) {
      console.error("Error al crear paciente:", error);
      throw new Error("Error al crear paciente");
    }
  },
};

export default PatientService;
