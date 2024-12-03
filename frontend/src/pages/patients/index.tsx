import Header from "@/components/Header";
import api from "@/services/api";
import { PatientType } from "@/types/dto.type";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";

const fetchPatients = async (accessToken: string) => {
  try {
    const { data } = await api.get(`/patients`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { data: data.data, error: false }; // Retorna los pacientes y una bandera para el error
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.error === "TokenExpiredError") {
        console.error("Token expired. Logging out...");
        return { data: [], error: true }; // Devolvemos una bandera indicando que el token expiró
      }
    }
    return { data: [], error: false }; // Si hubo otro error, devolvemos datos vacíos
  }
};

const PatientsPage = ({ patients }: { patients: PatientType[] }) => {
  return (
    <div>
      <Header />
      <div className="container mx-auto p-6 pt-20">
        <h1 className="text-2xl font-semibold">Lista de Pacientes</h1>
        <ul className="mt-4">
          {patients.map((patient) => (
            <li
              key={patient.id}
              className="bg-gray-100 p-4 rounded-lg shadow mb-4"
            >
              <Link href={`/patients/${patient.id}`}>
                <span className="text-blue-500">{patient.name}</span>
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

// Obtener la sesión y los pacientes desde el servidor
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login", // Redirigir al login si no hay sesión
        permanent: false,
      },
    };
  }

  const { data, error } = await fetchPatients(session.accessToken ?? "");

  if (error) {
    // Si el token ha expirado, redirigir al login desde el servidor
    return {
      redirect: {
        destination: "/login", // Redirigir al login
        permanent: false,
      },
    };
  }

  return {
    props: { patients: data }, // Pasamos los pacientes obtenidos
  };
};

export default PatientsPage;
