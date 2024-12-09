export type ObservationType = {
  id: number;
  code: string;
  value: string;
  date: string;
  patient_id: number;
  user_id: number;
  category: string;
  components?: ComponentObservationTypeDto[];
};

export type ComponentObservationTypeDto = {
  id?: string;
  code: string;
  value: number;
  unit: string;
};

export type PatientType = {
  id: number;
  name: string;
  gender: string;
  birth_date: string;
  address: string;
};

export type PatientTypeDto = PatientType & {
  observations: number;
};

export type PatientObservationsType = PatientType & {
  observations: ObservationType[]; // Cambia el tipo de observations a ObservationType[]
};

export type StoreType = {
  patients: PatientType[];
  setPatients: (patients: PatientType[]) => void;
};
