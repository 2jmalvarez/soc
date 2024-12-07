import { v4 as uuidv4 } from "uuid";
import pool from "../db/postgres";

export interface Observation {
  id: string;
  patient_id: string;
  user_id: string;
  observation_code: string;
  value: string | null;
  date: string;
  status: string;
  category: string;
  components?: Component[];
}

export interface Component {
  id: string;
  observation_id: string;
  code: string;
  display: string;
  value: number;
  unit: string;
}

const ObservationModel = {
  async create({
    patient_id,
    user_id,
    observation_code,
    value,
    date,
    status,
    category,
    components,
  }: Omit<Observation, "id">): Promise<Observation> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const observationId = uuidv4();

      // Inserta la observación principal
      const queryObservation = `
        INSERT INTO observations (id, patient_id, user_id, observation_code, value, date, status, category) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`;
      const { rows: observationRows } = await client.query(queryObservation, [
        observationId,
        patient_id,
        user_id,
        observation_code,
        value,
        date,
        status,
        category,
      ]);

      const observation = observationRows[0];

      // Inserta los componentes si los hay
      if (components && components.length > 0) {
        const queryComponent = `
          INSERT INTO observation_components (id, observation_id, code, display, value, unit) 
          VALUES ($1, $2, $3, $4, $5, $6)`;
        for (const component of components) {
          const componentId = uuidv4();
          await client.query(queryComponent, [
            componentId,
            observationId,
            component.code,
            component.display,
            component.value,
            component.unit,
          ]);
        }
      }

      await client.query("COMMIT");
      return observation;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

export default ObservationModel;
