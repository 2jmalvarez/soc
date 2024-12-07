// frontend/pages/api/observations/index.ts

import {
  deleteObservation,
  postObservation,
  putObservation,
} from "@/services/api";
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
        console.log({ observation });

        const newObservation = await postObservation({
          accessToken: token,
          patientId: patient_id,
          observation,
        }); // Función para guardar en DB
        console.log({ newObservation });

        res.status(201).json(newObservation.data);
      } catch {
        res.status(401).json({ error: "Unauthorized" });
      }

      break;
    case "PUT":
      try {
        // Procesar la observación
        const { id, ...observation } = req.body;
        console.log({ observation });

        const newObservation = await putObservation({
          accessToken: token,
          observationId: id,
          observation,
        }); // Función para guardar en DB
        console.log({ newObservation });

        res.status(201).json(newObservation.data);
      } catch {
        res.status(401).json({ error: "Unauthorized" });
      }

      break;

    case "DELETE":
      try {
        // Procesar la observación
        const { observationId } = req.body;
        console.log({ observationId });

        const newObservation = await deleteObservation({
          accessToken: token,
          observationId: observationId,
        }); // Función para guardar en DB
        console.log({ newObservation });

        res.status(201).json(newObservation.data);
      } catch {
        res.status(401).json({ error: "Unauthorized" });
      }

      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
