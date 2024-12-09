import { v4 } from "uuid";
import pool from "../db/postgres";
import { ObservationComponents, Observations } from "../types/dao.type";

const ObservationModel = {
  async findAllByPatient(patientId: string): Promise<Observations[]> {
    const query = "SELECT * FROM observations WHERE patient_id = $1";
    const { rows } = await pool.query(query, [patientId]);
    return rows;
  },
  async findAllComponentsByPatient(
    patientId: string
  ): Promise<ObservationComponents[]> {
    const query = `
      SELECT * FROM observation_components
      WHERE observation_id in (SELECT id FROM observations WHERE patient_id = $1)`;
    const { rows } = await pool.query(query, [patientId]);
    return rows;
  },

  async create({
    patient_id,
    user_id,
    code,
    value,
    date,
    status,
    category,
    components,
  }: Omit<Observations, "id"> & {
    components: Omit<ObservationComponents, "id" | "observation_id">[];
  }): Promise<Observations> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const observationId = v4();
      console.log({ value });

      // Inserta la observación principal
      const queryObservation = `
        INSERT INTO observations (id, patient_id, user_id, code, value, date, status, category) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`;
      const { rows: observationRows } = await client.query(queryObservation, [
        observationId,
        patient_id,
        user_id,
        code,
        value,
        date,
        status,
        category,
      ]);

      const observation = observationRows[0];

      // Inserta los componentes si los hay
      if (components && components.length > 0) {
        const queryComponent = `
          INSERT INTO observation_components (id, observation_id, code, value, unit) 
          VALUES ($1, $2, $3, $4, $5)`;
        for (const component of components) {
          const componentId = v4();
          await client.query(queryComponent, [
            componentId,
            observationId,
            component.code,
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

  async findOneById(id: string): Promise<Observations | null> {
    const query = "SELECT * FROM observations WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  async update({
    id,
    code,
    value,
    date,
  }: Observations): Promise<Observations | null> {
    const query =
      "UPDATE observations SET code = $1, value = $2, date = $3 WHERE id = $4 RETURNING *";
    const { rows } = await pool.query(query, [code, value, date, id]);
    return rows.length > 0 ? rows[0] : null;
  },

  async delete(id: string): Promise<boolean> {
    const query = "DELETE FROM observations WHERE id = $1";
    const { rowCount } = await pool.query(query, [id]);
    return (rowCount ?? 0) > 0;
  },
};

export default ObservationModel;
