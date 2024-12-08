import { ObservationType } from "@/types/dto.type";
import axios, { AxiosResponse, isAxiosError } from "axios";
import { signOut } from "next-auth/react";

const handleErrorApi = <T>(error: unknown) => {
  if (axios.isAxiosError(error)) {
    const tokenExpired = error.response?.data?.error === "TokenExpiredError";

    return {
      data: [] as unknown as T,
      error: true,
      message: tokenExpired
        ? "Sesion vencida"
        : ((error.response?.data?.message ?? "") as string),
    };
  } else {
    return {
      data: [] as unknown as T,
      error: true,
      message: "Error no controlado handleErrorApi",
    };
  }
};

const handleResponseApi = <T>(response: AxiosResponse) => ({
  data: response.data.data as T,
  error: false,
  message: "",
});
// Crea una instancia de Axios con la URL base configurada en el archivo .env
export const api = axios.create({
  baseURL: process.env.NEXTAUTH_URL, // API de Node.js (localhost:3000)
  timeout: 10000, // Tiempo de espera para las solicitudes
});

export async function addObservation(
  accessToken: string,
  observation: {
    code: string;
    value: string;
    date: string;
    patient_id: number;
  }
) {
  try {
    const response = await api.post("/api/observations", observation, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Agregar el token en la cabecera
      },
    });

    return handleResponseApi<ObservationType>(response);
  } catch (error) {
    return handleErrorApi<ObservationType>(error);
  }
}

export async function updateObservation(
  accessToken: string,
  observation: {
    code: string;
    value: string;
    date: string;
    id: number;
  }
) {
  try {
    const response = await api.put("/api/observations", observation, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Agregar el token en la cabecera
      },
    });

    return handleResponseApi<ObservationType>(response);
  } catch (error) {
    return handleErrorApi<ObservationType>(error);
  }
}

export async function removeObservation(
  accessToken: string,
  observationId: number
) {
  try {
    const response = await api.delete("/api/observations", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Agregar el token en la cabecera
      },
      data: { observationId },
    });
    return handleResponseApi<ObservationType>(response);
  } catch (error) {
    return handleErrorApi<ObservationType>(error);
  }
}

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        signOut();
      }
      return Promise.reject(error);
    }

    // signOut();
    return Promise.reject(new Error(error));
  }
);
