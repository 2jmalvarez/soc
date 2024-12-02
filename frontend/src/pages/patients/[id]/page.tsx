import api from "@/services/api";
import { ObservationType } from "@/types/dto.type";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ObservationsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [observations, setObservations] = useState<ObservationType[]>([]);

  useEffect(() => {
    if (id) {
      const fetchObservations = async () => {
        const { data } = await api.get<ObservationType[]>(
          `/patients/${id}/observations`
        );
        setObservations(data);
      };
      fetchObservations();
    }
  }, [id]);

  return (
    <div>
      <h1>Observations</h1>
      <ul>
        {observations.map((obs) => (
          <li key={obs.id}>
            {obs.code}: {obs.value} (on {obs.date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ObservationsPage;
