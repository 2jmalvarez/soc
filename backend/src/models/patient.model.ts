import pool from "../db/db";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
}
export async function findAll(): Promise<Patient[]> {
  const query = "SELECT * FROM patients";
  const { rows } = await pool.query(query);
  return rows;
}

export async function findById(id: number): Promise<Patient | null> {
  const query = "SELECT * FROM patients WHERE id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows.length > 0 ? rows[0] : null;
}
