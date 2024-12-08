import { addObservation } from "@/services/api";
import "@radix-ui/react-dialog";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Button } from "../ui";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import usePatientStore from "@/hooks/useStore";
import { FilePlusIcon } from "lucide-react";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { v4 } from "uuid";

export const NewObservationModal = () => {
  const {
    patientObservations,
    setPatientObservations,
    observationsCategories,
  } = usePatientStore();
  const { toast } = useToast();
  const initObservation = {
    category: "",
    code: "",
    value: "",
    date: "",
  };
  const [newObservation, setNewObservation] = useState(initObservation);
  const [cargando, setCargando] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      const {
        data: addedObservation,
        error,
        message,
      } = await addObservation(session.accessToken, {
        ...newObservation,
        patient_id: patientObservations.id,
      });

      if (error) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } else {
        setPatientObservations({
          ...patientObservations,
          observations: [...patientObservations.observations, addedObservation],
        });
        toast({
          description: "Observación creada correctamente",
        });
        setNewObservation(initObservation);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error adding observation:", error);
    } finally {
      setCargando(false);
    }
  };
  console.log({ observationsCategories });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button className="flex" onClick={() => setIsOpen(true)}>
          <FilePlusIcon className="hover:text-blue-500" /> Nueva observación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar nueva observación</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form className="mt-4 space-y-4">
          <div>
            <label htmlFor="category" className="block font-semibold">
              Categoría
            </label>
            <Select
              onValueChange={(category) =>
                setNewObservation((prev) => ({ ...prev, category }))
              }
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Seleccioná una categoría" />
              </SelectTrigger>
              <SelectContent>
                {observationsCategories.map((category) => (
                  <SelectItem value={category.code} key={v4()}>
                    {category.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="code" className="block font-semibold">
              Código
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={newObservation.code}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
