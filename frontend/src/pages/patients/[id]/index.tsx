import { CardObservation } from "@/components/observations/CardObservation";
import { NewObservationModal } from "@/components/observations/NewObservationModal";
import { PatientCard } from "@/components/patients/Patient";
import { ScrollArea } from "@/components/ui/scroll-area";
import usePatientStore from "@/hooks/useStore";
import { getObservations } from "@/services/backend";
import { PatientObservationsType } from "@/types/dto.type";
import { ObservationCategoryType } from "@/types/fhir.type";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
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

  const apiObservationsCategories = await axios.get(
    "https://terminology.hl7.org/6.1.0/CodeSystem-observation-category.json"
  );

  const categories: ObservationCategoryType =
    apiObservationsCategories.data.concept;

  console.log({
    categories,
  });

  return {
    props: { patientObservations: data, categories }, // Pasamos solo los datos
  };
};

export default function ObservationsPage({
  patientObservations: patientObservationsDto,
  categories,
}: Readonly<{
  patientObservations: PatientObservationsType;
  categories: ObservationCategoryType[];
}>) {
  const {
    patientObservations,
    setPatientObservations,
    observationsCategories,
    setObservationsCategories,
  } = usePatientStore();

  useEffect(() => {
    setPatientObservations(patientObservationsDto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientObservationsDto]);

  useEffect(() => {
    setObservationsCategories(categories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observationsCategories]);

  const { observations, ...patient } = patientObservations;
  return (
    <div>
      <div className="container mx-auto p-6 pt-20">
        <div className="flex  justify-between">
          <div className="w-full">
            <PatientCard
              patient={{ ...patient, observations: observations?.length }}
            />
            <h1 className="text-2xl font-bold mb-4">
              Observaciones de <strong>{patientObservations?.name}</strong>
            </h1>
            <div className="flex justify-between w-full">
              <h2 className="text-xl font-bold mb-2 bg-white px-2 rounded">
                Lista de Observaciones (
                {patientObservations?.observations?.length}){" "}
              </h2>

              <NewObservationModal />
            </div>
            <ScrollArea>
              <div className=" pt-2  grid grid-cols-2 gap-6 w-full ">
                {patientObservations?.observations?.toReversed()?.map((obs) => (
                  <CardObservation
                    key={v4()}
                    observation={obs}
                    categories={categories}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
