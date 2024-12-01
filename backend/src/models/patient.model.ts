import pool from "../db/postgres";

export interface Patient {
  id: number;
  name: string;
  birth_date: number;
  gender: string;
  address?: string;
}

const PatientModel = {
  async findAll(): Promise<Patient[]> {
    try {
      const query = "SELECT * FROM patients";
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw new Error("Could not fetch patients");
    }
  },

  async findById(id: number): Promise<Patient | null> {
    try {
      const query = "SELECT * FROM patients WHERE id = $1";
      const { rows } = await pool.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error fetching patient with id ${id}:`, error);
      throw new Error("Could not fetch patient");
    }
  },

  async create(patient: Omit<Patient, "id">): Promise<Patient> {
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
  },

  async delete(id: number): Promise<boolean> {
    try {
      const query = "DELETE FROM patients WHERE id = $1";
      const { rowCount } = await pool.query(query, [id]);
      return (rowCount ?? 0) > 0;
    } catch (error) {
      console.error(`Error deleting patient with id ${id}:`, error);
      throw new Error("Could not delete patient");
    }
  },

  async update(patient: Patient): Promise<Patient | null> {
    try {
      const query = `
        UPDATE patients
        SET 
          name = $1,
          birth_date = $2,
          gender = $3,
          address = $4
        WHERE id = $5
        RETURNING *;
      `;
      const values = [
        patient.name,
        patient.birth_date,
        patient.gender,
        patient.address,
        patient.id,
      ];
      const { rows } = await pool.query(query, values);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error updating patient with id ${patient.id}:`, error);
      throw new Error("Could not update patient");
    }
  },
};

export default PatientModel;
