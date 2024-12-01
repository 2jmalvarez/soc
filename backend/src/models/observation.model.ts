import pool from "../db/db";

interface Observation {
  id: number;
  patientId: number;
  code: string;
  value: string;
  date: string;
}

export async function findAllByPatient(
  patientId: number
): Promise<Observation[]> {
  const query = "SELECT * FROM observations WHERE patient_id = $1";
  const { rows } = await pool.query(query, [patientId]);
  return rows;
}

export async function create({
  patientId,
  code,
  value,
  date,
}: Omit<Observation, "id">): Promise<Observation> {
  const query =
    "INSERT INTO observations (patient_id, code, value, date) VALUES ($1, $2, $3, $4) RETURNING *";
  const { rows } = await pool.query(query, [patientId, code, value, date]);
  return rows[0];
}

export async function findOneById(id: number): Promise<Observation | null> {
  const query = "SELECT * FROM observations WHERE id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows.length > 0 ? rows[0] : null;
}

export async function update({
  id,
  code,
  value,
  date,
}: Observation): Promise<Observation | null> {
  const query =
    "UPDATE observations SET code = $1, value = $2, date = $3 WHERE id = $4 RETURNING *";
  const { rows } = await pool.query(query, [code, value, date, id]);
  return rows.length > 0 ? rows[0] : null;
}

export async function deleted(id: number): Promise<boolean> {
  const query = "DELETE FROM observations WHERE id = $1";
  const { rowCount } = await pool.query(query, [id]);
  return (rowCount ?? 0) > 0;
}
