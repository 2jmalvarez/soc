// frontend/src/pages/patients/[id].tsx
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  addObservation,
  getObservations,
  removeObservation,
  updateObservation,
} from "@/services/api";
import { ObservationType, PatientObservationsType } from "@/types/dto.type";
import { FilePlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { id } = context.params ?? {};

  if (!session) {
    return {
      redirect: {
        destination: "/", // Redirigir al login si no hay sesión
        permanent: false,
      },
    };
  }

  if (!id || Array.isArray(id)) {
    return {
      notFound: true, // Retornar 404 si no hay id o si id es un array
    };
  }

  const { data, error } = await getObservations(session.accessToken ?? "", {
    id,
  });

  if (error) {
    // Si el token ha expirado, redirigir al login desde el servidor
    return {
      redirect: {
        destination: "/", // Redirigir al login
        permanent: false,
      },
    };
  }

  return {
    props: { patientObservations: data }, // Pasamos solo los datos
  };
};

export default function ObservationsPage({
  patientObservations,
}: {
  readonly patientObservations: PatientObservationsType;
}) {
  return (
    <div className="container mx-auto p-6 pt-20">
      <div className="flex  justify-between">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4">
            Observaciones de <strong>{patientObservations.name}</strong>
          </h1>
          <div className="flex justify-between w-full">
            <h2 className="text-xl font-bold mb-2">
              Lista de Observaciones ({patientObservations.observations.length}){" "}
            </h2>

            <NewObservationModal patient_id={patientObservations.id} />
          </div>
          <ul className="space-y-2 grid grid-cols-2 gap-4 w-full ">
            {patientObservations.observations.toReversed().map((obs) => (
              <CardObservation key={v4()} observation={obs} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const CardObservation = ({ observation }: { observation: ObservationType }) => (
  <li key={v4()} className="p-4 border rounded-md shadow">
    <div className="flex justify-between">
      <div>
        <p>
          <strong>ID:</strong> {observation.id}
        </p>
        <p>
          <strong>Code:</strong> {observation.observation_code}
        </p>
        <p>
          <strong>Value:</strong> {observation.value}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(observation.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Patient ID:</strong> {observation.patient_id}
        </p>
        <p>
          <strong>User ID:</strong> {observation.user_id}
        </p>{" "}
      </div>
      <div className="flex flex-col justify-between">
        <EditObservationModal observation={observation} />
        <DeleteObservationModal id={observation.id} />
      </div>
    </div>
  </li>
);

// const ObservationSaveModal = ({
//   newObservation,
//   handleInputChange,
//   handleSubmit,
//   cargando,
//   edit = false,
// }: ObservationSaveFormProps) => {
//   console.log({
//     newObservation,
//     handleInputChange,
//     handleSubmit,
//     cargando,
//     edit,
//   });
//   return (
//     <Dialog>
//       <DialogTrigger asChild className="cursor-pointer">
//         {edit ? (
//           <PencilIcon className="hover:text-green-500" />
//         ) : (
//           <Button className="flex ">
//             <FilePlusIcon className="hover:text-blue-500" /> Nueva observación
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>
//             {edit ? "Editar " : "Agregar nueva "}
//             observación
//           </DialogTitle>
//         </DialogHeader>
//         <form className="mt-4 space-y-4">
//           <div>
//             <label htmlFor="observation_code" className="block font-semibold">
//               Código
//             </label>
//             <input
//               id="observation_code"
//               name="observation_code"
//               type="text"
//               value={newObservation.observation_code}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="value" className="block font-semibold">
//               Valor
//             </label>
//             <input
//               id="value"
//               name="value"
//               type="text"
//               value={newObservation.value}
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="date" className="block font-semibold">
//               Fecha
//             </label>
//             <input
//               id="date"
//               name="date"
//               type="date"
//               value={
//                 newObservation.date &&
//                 new Date(newObservation.date).toISOString().split("T")[0]
//               }
//               onChange={handleInputChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>
//         </form>

//         <DialogFooter>
//           <Button
//             disabled={cargando}
//             onClick={() => handleSubmit(newObservation)}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             <div className="flex ">
//               <div className="flex text-center ">
//                 {cargando && <LoadingSpinner color="text-white w-4 h-4" />}{" "}
//                 Guardar
//               </div>
//             </div>
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

const NewObservationModal = ({ patient_id }: { patient_id: number }) => {
  const initObservation = {
    observation_code: "",
    value: "",
    date: "",
    patient_id,
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
      const addedObservation = await addObservation(
        session.accessToken,
        newObservation
      ); // Pasando el token
      if (addedObservation) {
        setCargando(false);
      }
    } catch (error) {
      console.error("Error adding observation:", error);
    }
  };
  useEffect(() => {
    return () => {
      setNewObservation(initObservation);
    };
  }, []);
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

const EditObservationModal = ({
  observation,
}: {
  observation: ObservationType;
}) => {
  const { patient_id, user_id, ...initOnservation } = observation;
  console.log({ patient_id, user_id });
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
      const addedObservation = await updateObservation(
        session.accessToken,
        observation
      );
      if (addedObservation) {
        setCargando(false);
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// modal elimiar observación
const DeleteObservationModal = ({ id }: { id: number }) => {
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async () => {
    const session = await getSession(); // Obtener la sesión del frontend

    if (!session?.accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      setCargando(true);
      const addedObservation = await removeObservation(session.accessToken, id);
      if (addedObservation) {
        setCargando(false);
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
          <Button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleSubmit}
          >
            <div className="flex text-center">
              {cargando && <LoadingSpinner color="text-white w-4 h-4" />}{" "}
              Eliminar
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
