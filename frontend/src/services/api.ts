import {
  ObservationType,
  PatientObservationsType,
  PatientType,
} from "@/types/dto.type";
import axios from "axios";

// Importar getSession de NextAuth

// Crea una instancia de Axios con la URL base configurada en el archivo .env
const api = axios.create({
  baseURL: process.env.API_URL, // API de Node.js (localhost:3000)
  timeout: 10000, // Tiempo de espera para las solicitudes
});

export const getPatients = async (accessToken: string) => {
  try {
    const { data } = await api.get<{ data: PatientType[]; error: boolean }>(
      `/patients`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log({ data: data.data[0] });

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

export const getObservations = async (accessToken: string, { id = "" }) => {
  try {
    const { data } = await api.get<{
      data: PatientObservationsType;
      error: boolean;
    }>(`/patients/${id}/observations`, {
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

export const postObservation = async (props: {
  accessToken: string;
  patientId: string;
  observation: Omit<ObservationType, "patient_id">;
}) => {
  try {
    const { accessToken, patientId, observation } = props;
    const { data } = await api.post<{
      data: PatientObservationsType;
      error: boolean;
    }>(`/patients/${patientId}/observations`, observation, {
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

// frontend/services/api.ts
export async function addObservation(
  accessToken: string,
  observation: {
    observation_code: string;
    value: string;
    date: string;
    patient_id: number;
  }
) {
  const response = await fetch("/api/observations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Agregar el token en la cabecera
    },
    body: JSON.stringify(observation),
  });

  if (!response.ok) {
    throw new Error("Failed to add observation");
  }

  return await response.json();
}

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     console.log({ token });

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(new Error(error));
//   }
// );

export default api;
