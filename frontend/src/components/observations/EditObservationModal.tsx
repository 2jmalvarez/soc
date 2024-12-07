import { LoadingSpinner } from "../LoadingSpinner";
import { Button } from "../ui";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import usePatientStore from "@/hooks/useStore";
import { updateObservation } from "@/services/api";
import { ObservationType } from "@/types/dto.type";
import { PencilIcon } from "lucide-react";
import { getSession } from "next-auth/react";
import { useState } from "react";

export const EditObservationModal = ({
  observation,
}: {
  observation: ObservationType;
}) => {
  const { patientObservations, setPatientObservations } = usePatientStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { patient_id, user_id, ...initOnservation } = observation;

  const [newObservation, setNewObservation] = useState(initOnservation);
  const [cargando, setCargando] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewObservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    observation: Omit<ObservationType, "patient_id" | "user_id">
  ) => {
    const session = await getSession(); // Obtener la sesión del frontend

    if (!session?.accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      setCargando(true);
      const updatedObservation = await updateObservation(
        session.accessToken,
        observation
      );
      if (updatedObservation) {
        setCargando(false);

        setPatientObservations({
          ...patientObservations,
          observations: patientObservations.observations.map((obs) =>
            obs.id === updatedObservation.id ? updatedObservation : obs
          ),
        });
      }
    } catch (error) {
      console.error("Error adding observation:", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <PencilIcon className="hover:text-green-500" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar observación</DialogTitle>
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
              onClick={() => handleSubmit(newObservation)}
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
