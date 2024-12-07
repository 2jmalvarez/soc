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

const handleError = <T>(error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.error === "TokenExpiredError") {
      console.error("Token expired. Logging out...");
    }
    return {
      data: [] as unknown as T,
      error: true,
      message: (error.response?.data?.message ?? "") as string,
    };
  }
  return {
    data: [] as unknown as T,
    error: true,
    message: "Error no controlado",
  }; // Si hubo otro error, devolvemos datos vacíos
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

    return { data: data.data, error: false, message: "" }; // Retorna los pacientes y una bandera para el error
  } catch (error) {
    return handleError<PatientObservationsType>(error);
  }
};

export const putObservation = async (props: {
  accessToken: string;
  observationId: string;
  observation: Omit<ObservationType, "patient_id">;
}) => {
  try {
    const { accessToken, observationId, observation } = props;
    const { data } = await api.put<{
      data: PatientObservationsType;
      error: boolean;
    }>(`/observations/${observationId}`, observation, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { data: data.data, error: false, message: "" }; // Retorna los pacientes y una bandera para el error
  } catch (error) {
    return handleError<PatientObservationsType>(error);
  }
};

export const deleteObservation = async (props: {
  accessToken: string;
  observationId: number;
}) => {
  try {
    const { accessToken, observationId } = props;
    const { data } = await api.delete<{
      data: PatientObservationsType;
      error: boolean;
    }>(`/observations/${observationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { data: data.data, error: false, message: "" }; // Retorna los pacientes y una bandera para el error
  } catch (error) {
    return handleError<PatientObservationsType>(error);
  }
};

const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    return { error: true, message: data, data: {} };
  }

  return { error: false, message: "", data };
};

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
  return handleResponse(response);
}

export async function updateObservation(
  accessToken: string,
  observation: {
    observation_code: string;
    value: string;
    date: string;
    id: number;
  }
) {
  const response = await fetch("/api/observations", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Agregar el token en la cabecera
    },
    body: JSON.stringify(observation),
  });
  return handleResponse(response);
}

export async function removeObservation(
  accessToken: string,
  observationId: number
) {
  const response = await fetch("/api/observations", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Agregar el token en la cabecera
    },
    body: JSON.stringify({ observationId }),
  });
  return handleResponse(response);
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
