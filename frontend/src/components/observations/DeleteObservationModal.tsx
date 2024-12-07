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
import { removeObservation } from "@/services/api";
import { Trash2Icon } from "lucide-react";
import { getSession } from "next-auth/react";
import { useState } from "react";

export const DeleteObservationModal = ({ id }: { id: number }) => {
  const { patientObservations, setPatientObservations } = usePatientStore();

  const [cargando, setCargando] = useState(false);

  const handleSubmit = async () => {
    const session = await getSession(); // Obtener la sesión del frontend

    if (!session?.accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      setCargando(true);
      const deletedObservation = await removeObservation(
        session.accessToken,
        id
      );
      if (deletedObservation) {
        setCargando(false);
        setPatientObservations({
          ...patientObservations,
          observations: patientObservations.observations.filter(
            (obs) => obs.id !== id
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
        <Trash2Icon className="hover:text-red-500" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar observación</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleSubmit}
            >
              <div className="flex text-center">
                {cargando && <LoadingSpinner color="text-white w-4 h-4" />}{" "}
                Eliminar
              </div>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
