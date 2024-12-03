import axios from "axios";

// Importar getSession de NextAuth

// Crea una instancia de Axios con la URL base configurada en el archivo .env
const api = axios.create({
  baseURL: process.env.API_URL, // API de Node.js (localhost:3000)
  timeout: 10000, // Tiempo de espera para las solicitudes
});

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
