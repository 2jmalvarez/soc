import { DeleteObservationModal } from "./DeleteObservationModal";
import { EditObservationModal } from "./EditObservationModal";
import { ObservationType } from "@/types/dto.type";
import { v4 } from "uuid";

export const CardObservation = ({
  observation,
}: {
  observation: ObservationType;
}) => (
  <div key={v4()} className="p-4 border rounded-md shadow bg-white">
    <div className="flex justify-between">
      <div>
        <p>
          <strong>ID:</strong> {observation.id}
        </p>
        <p>
          <strong>Code:</strong> {observation.code}
        </p>
        <p>
          <strong>Value:</strong> {observation.value}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(observation.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Patient ID:</strong> {observation.patient_id}
        </p>
        <p>
          <strong>User ID:</strong> {observation.user_id}
        </p>{" "}
      </div>
      <div className="flex flex-col justify-between">
        <EditObservationModal observation={observation} />
        <DeleteObservationModal id={observation.id} />
      </div>
    </div>
  </div>
);
