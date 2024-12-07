import { addObservation } from "@/services/api";
import "@radix-ui/react-dialog";
import { LoadingSpinner } from "../LoadingSpinner";
import { Button } from "../ui";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import useStore from "@/hooks/useStore";
import { FilePlusIcon } from "lucide-react";
import { getSession } from "next-auth/react";
import { useState } from "react";

export const NewObservationModal = () => {
  const { patientObservations, setPatientObservations } = useStore();

  const initObservation = {
    observation_code: "",
    value: "",
    date: "",
  };
  const [newObservation, setNewObservation] = useState(initObservation);
  const [cargando, setCargando] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewObservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const session = await getSession(); // Obtener la sesión del frontend

    if (!session?.accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      setCargando(true);
      const addedObservation = await addObservation(session.accessToken, {
        ...newObservation,
        patient_id: patientObservations.id,
      }); // Pasando el token
      if (addedObservation) {
        setCargando(false);

        setPatientObservations({
          ...patientObservations,
          observations: [...patientObservations.observations, addedObservation],
        });
      }
    } catch (error) {
      console.error("Error adding observation:", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <Button className="flex">
          <FilePlusIcon className="hover:text-blue-500" /> Nueva observación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar nueva observación</DialogTitle>
        </DialogHeader>
        <form className="mt-4 space-y-4">
          <div>
            <label htmlFor="observation_code" className="block font-semibold">
              Código
            </label>
            <input
              id="observation_code"
              name="observation_code"
              type="text"
              value={newObservation.observation_code}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="value" className="block font-semibold">
              Valor
            </label>
            <input
              id="value"
              name="value"
              type="text"
              value={newObservation.value}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block font-semibold">
              Fecha
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={
                newObservation.date &&
                new Date(newObservation.date).toISOString().split("T")[0]
              }
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={cargando}
              onClick={() => handleSubmit()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <div className="flex text-center">
                {cargando && <LoadingSpinner color="text-white w-4 h-4" />}{" "}
                Guardar
              </div>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
