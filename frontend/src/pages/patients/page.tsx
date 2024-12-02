import useStore from "@/hooks/useStore";
import api from "@/services/api";
import { useEffect } from "react";

const PatientsPage = () => {
  const { patients, setPatients } = useStore();

  useEffect(() => {
    const fetchPatients = async () => {
      const { data } = await api.get("/patients");
      setPatients(data);
    };
    fetchPatients();
  }, [setPatients]);

  return (
    <div>
      <h1>Patients</h1>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PatientsPage;
