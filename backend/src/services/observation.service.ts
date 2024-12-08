import { Observation } from "./../models/observation.fhir.model";
import ObservationModel from "./../models/observation.model";
import PatientModel, { Patient } from "../models/patient.model";
import dayjs from "dayjs";
import { ValidationError } from "./error.service";
import { fhirR4 } from "@smile-cdr/fhirts";

// Crear paciente

const ObservationService = {
  // async createFhir({
  //   patient_id,
  //   user_id,
  //   code,
  //   value,
  //   date,
  //   status,
  //   category,
  //   components,
  // }: {
  //   patient_id: string;
  //   user_id: string;
  //   code: string;
  //   value: string
  //   date: string;
  //   status: string;
  //   category: string;
  //   components: any;
  // } ) {
  //   try {
  //     // const newObservation = new fhirR4.Observation();

  //     // newObservation.status = status;
  //     // newObservation.code = new fhirR4.CodeableConcept();
  //     // newObservation.code.text = "Paciente";
  //     // newObservation.subject = new fhirR4.Reference();
  //     // newObservation.subject.reference = `Patient/${patient.id}`;

  //     ObservationModel.create({
  //       patient_id,
  //       user_id,
  //       code,
  //       value,
  //       date,
  //       status,
  //       category,
  //       components
  //     })

  //     // newObservation

  //     //   const patients = await PatientModel.findAll(); // seria mas eficiente tener un model y hacer la consulta directamente en la DB
  //     //   // se toma como mpi que el paciente existe si tiene el mismo nombre, fecha de nacimiento y genero
  //     //   const patientExist = patients.some(
  //     //     (p) =>
  //     //       p.name === patient.name &&
  //     //       dayjs(p.birth_date).isSame(dayjs(patient.birth_date), "day") &&
  //     //       p.gender === patient.gender
  //     //   );

  //     //   if (patientExist) {
  //     //     throw new ValidationError("El paciente ya existe");
  //     //   }

  //     return newObservation;
  //   } catch (error: any) {
  //     console.error(
  //       "ObservationService: Error al crear observacion fhir ",
  //       error
  //     );
  //     throw error;
  //   }
  // },
  async getObservations(patientId: string) {
    try {
      const observations = await ObservationModel.findAllByPatient(patientId);
      const patient = await PatientModel.findById(patientId);
      return { ...patient, observations };
    } catch (error: any) {
      console.error(
        "ObservationService: Error al obtener observaciones ",
        error
      );
      throw error;
    }
  },
};

export default ObservationService;
