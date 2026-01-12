import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Grade() {
  const { deliverableId } = useParams();
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  // TODO: Ar trebui sa aducem si detalii despre livrabil aici, momentan presupunem ca utilizatorul stie ce noteaza
  // sau am putea modifica backend-ul sa returneze si livrabilul la GET /api/grades/:id

  useEffect(() => {
    fetchGrades();
  }, [deliverableId]);

  async function fetchGrades() {
    try {
      const res = await api.get(`/api/grades/${deliverableId}`);
      setGrades(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGrade(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/api/grades", {
        deliverableId,
        value
      });
      setMessage("Notă acordată cu succes!");
      setValue("");
      fetchGrades();
    } catch (err) {
      setMessage(err.response?.data?.error || "Eroare la notare.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Acordă Notă</h1>
        <p className="text-gray-600 mb-6">
          Notezi livrabilul cu ID: <strong>{deliverableId}</strong>
        </p>

        {message && <div className="p-3 bg-blue-50 text-blue-700 rounded mb-4">{message}</div>}

        <form onSubmit={handleGrade} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nota (1.00 - 10.00)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              max="10"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={value}
              onChange={e => setValue(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Trimite Nota
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Istoric Note (Pentru acest livrabil)</h2>
        {grades.length === 0 ? (
          <p className="text-gray-500">Nu sunt note acordate încă.</p>
        ) : (
          <ul className="space-y-2">
            {grades.map(g => (
              <li key={g.id} className="border-b pb-2 flex justify-between">
                <span>Nota: <strong>{g.value}</strong></span>
                <span className="text-sm text-gray-500">{new Date(g.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
        &larr; Înapoi
      </button>
    </div>
  );
}
