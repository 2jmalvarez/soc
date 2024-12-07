// frontend/pages/api/observations/index.ts

import {
  deleteObservation,
  postObservation,
  putObservation,
} from "@/services/backend";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1]; // Obtener el token de la cabecera

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  switch (req.method) {
    case "POST":
      try {
        // Procesar la observación
        const { patient_id, ...observation } = req.body;

        const newObservation = await postObservation({
          accessToken: token,
          patientId: patient_id,
          observation,
        }); // Función para guardar en DB
        res
          .status(newObservation.status)
          .json(newObservation.error ? newObservation : newObservation.data);
      } catch {
        console.log("Error");

        res.status(401).json({ error: "Unauthorized" });
      }

      break;
    case "PUT":
      try {
        // Procesar la observación
        const { id, ...observation } = req.body;

        const newObservation = await putObservation({
          accessToken: token,
          observationId: id,
          observation,
        }); // Función para guardar en DB
        res
          .status(newObservation.status)
          .json(newObservation.error ? newObservation : newObservation.data);
      } catch {
        res.status(400).json({ error: "BadRequest" });
      }

      break;

    case "DELETE":
      try {
        // Procesar la observación
        const { observationId } = req.body;

        const newObservation = await deleteObservation({
          accessToken: token,
          observationId: observationId,
        }); // Función para guardar en DB

        res
          .status(newObservation.status)
          .json(newObservation.error ? newObservation : newObservation.data);
      } catch {
        res.status(400).json({ error: "BadRequest" });
      }

      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
