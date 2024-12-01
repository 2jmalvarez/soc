import pool from "../db/postgres";

interface Patient {
  id: number;
  name: string;
  birth_date: number;
  gender: string;
  address?: string;
}
export async function findAll(): Promise<Patient[]> {
  try {
    const query = "SELECT * FROM patients";
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw new Error("Could not fetch patients");
  }
}

export async function findById(id: number): Promise<Patient | null> {
  try {
    const query = "SELECT * FROM patients WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error(`Error fetching patient with id ${id}:`, error);
    throw new Error("Could not fetch patient");
  }
}

export async function addPatient(
  patient: Omit<Patient, "id">
): Promise<Patient> {
  try {
    const query = `
      INSERT INTO patients (name, birth_date, gender, address)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      patient.name,
      patient.birth_date,
      patient.gender,
      patient?.address ?? null,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error adding patient:", error);
    throw new Error("Could not add patient");
  }
}
