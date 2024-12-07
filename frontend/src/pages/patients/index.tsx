import { PatientCard } from "@/components/patients/Patient";
import usePatientStore from "@/hooks/useStore";
import { getPatients } from "@/services/api";
import { PatientTypeDto } from "@/types/dto.type";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { v4 } from "uuid";

// Obtener la sesión y los pacientes desde el servidor
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  console.log({ session });
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
  const { setPatients, patients } = usePatientStore();
  useEffect(() => {
    setPatients(patientsDto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientsDto]);
  return (
    <div>
      <div className="container mx-auto p-6 pt-20">
        <h1 className="text-2xl font-semibold">Lista de Pacientes</h1>
        <div className="mt-4 flex flex-wrap">
          {patients.map((patient) => (
            <PatientCard key={v4()} patient={patient} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;
