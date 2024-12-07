// frontend/src/pages/patients/[id].tsx
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui";
import { addObservation, getObservations } from "@/services/api";
import { ObservationType, PatientObservationsType } from "@/types/dto.type";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
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
  const [observations, setObservations] = useState(
    patientObservations.observations
  );
  const [newObservation, setNewObservation] = useState({
    observation_code: "",
    value: "",
    date: "",
    patient_id: patientObservations.id,
  });
  const [cargando, setCargando] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewObservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setObservations((prev) => [...prev, addedObservation]);
        setNewObservation({
          observation_code: "",
          value: "",
          date: "",
          patient_id: patientObservations.id,
        });
      }
    } catch (error) {
      console.error("Error adding observation:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 pt-20">
      <div className="flex  justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4">
            Observaciones de <strong>{patientObservations.name}</strong>
          </h1>
          <h2 className="text-xl font-bold mb-2">
            Lista de Observaciones ({observations.length}){" "}
          </h2>
          <ul className="space-y-2">
            {observations.toReversed().map((obs) => (
              <CardObservation key={v4()} observation={obs} />
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold mt-2">Agregar Nueva Observación</h2>
          <AddObservationForm
            newObservation={newObservation}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            cargando={cargando}
          />
        </div>
      </div>
    </div>
  );
}

const CardObservation = ({ observation }: { observation: ObservationType }) => (
  <li key={v4()} className="p-4 border rounded-md shadow">
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
      <strong>Date:</strong> {new Date(observation.date).toLocaleDateString()}
    </p>
    <p>
      <strong>Patient ID:</strong> {observation.patient_id}
    </p>
    <p>
      <strong>User ID:</strong> {observation.user_id}
    </p>
  </li>
);

interface AddObservationFormProps {
  newObservation: {
    observation_code: string;
    value: string;
    date: string;
    patient_id: number;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  cargando: boolean;
}

const AddObservationForm = ({
  newObservation,
  handleInputChange,
  handleSubmit,
  cargando,
}: AddObservationFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
          value={newObservation.date}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <Button
        disabled={cargando}
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <div className="flex ">
          <div className="flex text-center ">
            {cargando && <LoadingSpinner color="text-white w-4 h-4" />} Agregar
            Observación
          </div>
        </div>
      </Button>
    </form>
  );
};
