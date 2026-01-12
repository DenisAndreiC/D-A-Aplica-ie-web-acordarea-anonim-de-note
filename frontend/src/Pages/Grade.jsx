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
    <div className="min-h-screen bg-orange-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-6 font-medium transition-colors">
          &larr; Înapoi
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-rose-300 to-orange-200 px-6 py-4">
            <h1 className="text-xl font-bold text-white">Acordă Notă</h1>
            <p className="text-white/80 text-sm font-medium">Evaluezi livrabilul #{deliverableId}</p>
          </div>

          <div className="p-6 space-y-6">
            {message && (
              <div className={`p-3 rounded-lg text-sm text-center font-medium ${message.includes("succes") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Nota ta (1.00 - 10.00)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="10"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-center text-lg font-bold text-gray-800 focus:ring-2 focus:ring-pink-300 focus:bg-white outline-none transition"
                    placeholder="10.00"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-orange-200/50 shadow-md transition-all active:scale-95">
                Trimite Nota
              </button>
            </form>
          </div>
        </div>

        {/* Istoric Note - Optional pentru jurat sa vada ce au dat altii? Sau doar notele lui? Momentan vede tot */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">Istoric Note</h2>
          {grades.length === 0 ? (
            <p className="text-gray-400 text-center text-sm py-2">Fără note acordate.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {grades.map(g => (
                <div key={g.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">{new Date(g.createdAt).toLocaleDateString()}</span>
                  <span className="font-bold text-blue-600">{g.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
