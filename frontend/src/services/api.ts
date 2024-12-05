import { PatientObservationsType, PatientType } from "@/types/dto.type";
import axios from "axios";

// Importar getSession de NextAuth

// Crea una instancia de Axios con la URL base configurada en el archivo .env
const api = axios.create({
  baseURL: process.env.API_URL, // API de Node.js (localhost:3000)
  timeout: 10000, // Tiempo de espera para las solicitudes
});

export const fetchPatients = async (accessToken: string) => {
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

export const fetchObservations = async (accessToken: string, { id = "" }) => {
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
