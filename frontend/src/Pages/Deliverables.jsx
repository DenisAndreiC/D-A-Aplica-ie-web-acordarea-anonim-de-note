import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Deliverables() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [deliverables, setDeliverables] = useState([]);
  const [formData, setFormData] = useState({ resourceUrl: "", description: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDeliverables();
  }, [projectId]);

  async function fetchDeliverables() {
    try {
      const res = await api.get(`/api/deliverables/project/${projectId}`);
      setDeliverables(res.data);
    } catch (error) {
      console.error("Eroare incarcare livrabile:", error);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/api/deliverables", {
        projectId,
        ...formData
      });
      setMessage("Livrabil adăugat cu succes!");
      setFormData({ resourceUrl: "", description: "" });
      fetchDeliverables();
    } catch (error) {
      setMessage("Eroare la adăugare livrabil.");
      console.error(error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Livrabile Proiect #{projectId}</h1>
        <button onClick={() => navigate("/dashboard")} className="text-gray-600 hover:text-gray-900">
          &larr; Înapoi la Dashboard
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Lista Livrabile */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Resurse Încărcate</h2>

          {deliverables.length === 0 ? (
            <p className="text-gray-500 text-sm">Nu ai încărcat nimic momentan.</p>
          ) : (
            <ul className="space-y-4">
              {deliverables.map((d) => (
                <li key={d.id} className="border-b pb-2 last:border-0">
                  <a
                    href={d.resourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-medium hover:underline block truncate"
                  >
                    {d.resourceUrl}
                  </a>
                  <p className="text-sm text-gray-700 mt-1">{d.description}</p>
                  <span className="text-xs text-gray-400">
                    Adăugat pe {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Adauga Livrabil */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Adaugă Resursă</h2>
          {message && <div className="mb-3 p-2 bg-blue-50 text-blue-700 text-sm rounded">{message}</div>}

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Link Resursă (Video/Drive/GitHub)</label>
              <input
                type="url"
                required
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://..."
                value={formData.resourceUrl}
                onChange={(e) => setFormData({ ...formData, resourceUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descriere scurtă</label>
              <textarea
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                rows="2"
                required
                placeholder="Ex: Demo video funcționalitate login..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
              Încarcă Livrabil
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
