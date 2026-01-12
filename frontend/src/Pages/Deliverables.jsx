import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Deliverables() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [deliverables, setDeliverables] = useState([]);
  const [project, setProject] = useState(null); // Detalii proiect
  const [formData, setFormData] = useState({ resourceUrl: "", description: "" });
  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchProject();
    fetchDeliverables();
  }, [projectId]);

  async function fetchProject() {
    try {
      const res = await api.get(`/api/projects/${projectId}`);
      setProject(res.data);
    } catch (error) {
      console.error("Eroare incarcare proiect:", error);
    }
  }

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
      const errorMsg = error.response?.data?.error || "Eroare la adăugare livrabil.";
      setMessage(errorMsg);
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-indigo-50/30 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Livrabile Proiect</h1>
            <p className="text-gray-500 text-sm">Gestionează resursele și demo-urile pentru acest proiect.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 hover:text-blue-600 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            &larr; Înapoi la Dashboard
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Coloana Stanga: Lista Livrabile */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-700">Resurse Încărcate</h2>
              </div>

              <div className="p-6">
                {deliverables.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    Nu există livrabile încărcate.
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {deliverables.map((d) => (
                      <li key={d.id} className="group border border-gray-100 rounded-lg p-4 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
                        <div className="flex justify-between items-start gap-4">
                          <div className="overflow-hidden">
                            <a
                              href={d.resourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 font-semibold hover:underline truncate block"
                            >
                              {d.resourceUrl}
                            </a>
                            <p className="text-sm text-gray-600 mt-1">{d.description}</p>
                            <span className="text-xs text-gray-400 mt-2 block">
                              {new Date(d.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <button
                            onClick={() => navigate(`/grade/${d.id}`)}
                            className="shrink-0 bg-white border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-50 hover:border-green-300 transition shadow-sm"
                          >
                            Notează
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Coloana Dreapta: Formular Adaugare - DOAR PENTRU PROPRIETAR */}
          {/* Folosim == pentru a permite comparatie string vs number */}
          {project?.ownerId == currentUser.id && (
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="font-bold text-gray-800 mb-4">Adaugă Resursă</h2>
                {message && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("succes") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Link (Video/Repo)</label>
                    <input
                      type="url"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="https://..."
                      value={formData.resourceUrl}
                      onChange={(e) => setFormData({ ...formData, resourceUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descriere</label>
                    <textarea
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                      rows="3"
                      required
                      placeholder="Ce reprezintă acest link?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                  <button className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
                    Adaugă
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
