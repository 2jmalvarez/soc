import {
  ObservationType,
  PatientObservationsType,
  PatientType,
} from "@/types/dto.type";
import axios, { AxiosResponse } from "axios";

// Importar getSession de NextAuth

// Crea una instancia de Axios con la URL base configurada en el archivo .env
export const backend = axios.create({
  baseURL: process.env.API_URL, // API de Node.js (localhost:3000)
  timeout: 10000, // Tiempo de espera para las solicitudes
});

export const handleErrorBack = <T>(error: unknown) => {
  if (axios.isAxiosError(error)) {
    const tokenExpired = error.response?.data?.error === "TokenExpiredError";

    if (tokenExpired) console.error("Token expired. Logging out...");

    return {
      data: [] as unknown as T,
      error: true,
      message: tokenExpired
        ? "Sesion vencida"
        : ((error.response?.data?.message ?? "") as string),
      status: error.response?.status ?? 500,
    };
  } else {
    return {
      data: [] as unknown as T,
      error: true,
      message: "Error no controlado handleErrorBack",
      status: 500,
    };
  }
};

export const handleResponseBack = <T>(response: AxiosResponse) => ({
  data: response.data.data as T,
  error: false,
  message: "",
  status: response.status,
});

export const getPatients = async (accessToken: string) => {
  try {
    const res = await backend.get<{ data: PatientType[]; error: boolean }>(
      `/patients`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return handleResponseBack<PatientType[]>(res);
  } catch (error) {
    console.error("Error en getPatients", error);

    return handleErrorBack<PatientType[]>(error);
  }
};

export const getObservations = async (accessToken: string, { id = "" }) => {
  try {
    const res = await backend.get<{
      data: PatientObservationsType;
      error: boolean;
    }>(`/patients/${id}/observations`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponseBack<PatientObservationsType>(res);
  } catch (error) {
    return handleErrorBack<PatientObservationsType>(error);
  }
};

export const postObservation = async (props: {
  accessToken: string;
  patientId: string;
  observation: Omit<ObservationType, "patient_id">;
}) => {
  try {
    const { accessToken, patientId, observation } = props;

    const res = await backend.post(
      `/patients/${patientId}/observations`,
      observation,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return handleResponseBack<ObservationType>(res);
  } catch (error) {
    return handleErrorBack<ObservationType>(error);
  }
};

export const putObservation = async (props: {
  accessToken: string;
  observationId: string;
  observation: Omit<ObservationType, "patient_id">;
}) => {
  try {
    const { accessToken, observationId, observation } = props;
    const res = await backend.put(
      `/observations/${observationId}`,
      observation,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return handleResponseBack<ObservationType>(res); // Retorna los pacientes y una bandera para el error
  } catch (error) {
    return handleErrorBack<ObservationType>(error);
  }
};

export const deleteObservation = async (props: {
  accessToken: string;
  observationId: number;
}) => {
  try {
    const { accessToken, observationId } = props;
    const res = await backend.delete(`/observations/${observationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponseBack<ObservationType>(res);
  } catch (error) {
    return handleErrorBack<ObservationType>(error);
  }
};
