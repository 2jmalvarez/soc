import { PatientObservationsType, PatientTypeDto } from "@/types/dto.type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Store {
  patients: PatientTypeDto[];
  setPatients: (patients: PatientTypeDto[]) => void;
  patientObservations: PatientObservationsType;
  setPatientObservations: (
    patientObservations: PatientObservationsType
  ) => void;
}

//TODO: separar en dos stores
//TODO: ver inferencia de tipos
const usePatientStore = create<Store>()(
  devtools((set) => ({
    patients: [],
    setPatients: (patients) => set({ patients }),
    patientObservations: {} as PatientObservationsType,
    setPatientObservations: (patientObservations) =>
      set({ patientObservations }),
  }))
);

export default usePatientStore;
