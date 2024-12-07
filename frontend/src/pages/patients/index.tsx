import useStore from "@/hooks/useStore";
import { getPatients } from "@/services/api";
import { PatientTypeDto } from "@/types/dto.type";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

// Obtener la sesión y los pacientes desde el servidor
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/", // Redirigir al login si no hay sesión
        permanent: false,
      },
    };
  }

  const { data, error } = await getPatients(session.accessToken ?? "");

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
    props: { patients: data }, // Pasamos los pacientes obtenidos
  };
};

const PatientsPage = ({
  patients: patientsDto,
}: {
  patients: PatientTypeDto[];
}) => {
  const { setPatients, patients } = useStore();
  useEffect(() => {
    setPatients(patientsDto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientsDto]);
  return (
    <div>
      <div className="container mx-auto p-6 pt-20">
        <h1 className="text-2xl font-semibold">Lista de Pacientes</h1>
        <ul className="mt-4 flex flex-wrap">
          {patients.map((patient) => (
            <li
              key={patient.id}
              className="bg-gray-100 p-4 rounded-lg shadow m-4 w-80  "
            >
              <Link href={`/patients/${patient.id}`}>
                <span className="text-blue-500">
                  {patient.name} ({patient.observations})
                </span>
              </Link>
              <div className="text-sm text-gray-600">
                <p>Género: {patient.gender}</p>
                <p>
                  Fecha de nacimiento:{" "}
                  {new Date(patient.birth_date).toLocaleDateString()}
                </p>
                <p>Dirección: {patient.address}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientsPage;
