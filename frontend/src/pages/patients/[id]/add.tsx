import api from "@/services/api";
import { useRouter } from "next/router";
import { useState } from "react";

const AddObservationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({ code: "", value: "", date: "" });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await api.post(`/patients/${id}/observations`, form);
    router.push(`/patients/${id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Code"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
      />
      <input
        type="text"
        placeholder="Value"
        value={form.value}
        onChange={(e) => setForm({ ...form, value: e.target.value })}
      />
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <button type="submit">Add Observation</button>
    </form>
  );
};

export default AddObservationPage;
