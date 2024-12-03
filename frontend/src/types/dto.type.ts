export type ObservationType = {
  id: number;
  patientId: number;
  code: string;
  value: string;
  date: string;
};

export type PatientType = {
  id: number;
  name: string;
  gender: string;
  birth_date: string;
  address: string;
  observations: ObservationType[];
};

export type StoreType = {
  patients: PatientType[];
  setPatients: (patients: PatientType[]) => void;
};
