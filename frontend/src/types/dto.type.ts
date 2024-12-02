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
  age: number;
  condition: string;
};

export type StoreType = {
  patients: PatientType[];
  setPatients: (patients: PatientType[]) => void;
};
