import { fetchObservations } from "@/services/api";
import { PatientObservationsType } from "@/types/dto.type";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

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

  const { data, error } = await fetchObservations(session.accessToken ?? "", {
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
    props: { patientObservations: data }, // Pasamos las observaciones obtenidas
  };
};

export default function ObservationsPage({
  patientObservations,
}: {
  readonly patientObservations: PatientObservationsType;
}) {
  console.log({ patientObservations });
  return (
    <div className="container mx-auto p-6 pt-20">
      <h1>Observaciones</h1>
      <ul>
        {patientObservations.observations.map((pt) => (
          <li key={pt.id}>{pt.value}</li>
        ))}
      </ul>
    </div>
  );
}
