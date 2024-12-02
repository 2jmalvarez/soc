import { create } from "zustand";

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
}

interface Store {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
}

const useStore = create<Store>((set) => ({
  patients: [],
  setPatients: (patients) => set({ patients }),
}));

export default useStore;
