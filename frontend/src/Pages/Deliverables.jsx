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
    <div className="min-h-screen bg-orange-50/30 pb-20">
      <div className="bg-gradient-to-r from-rose-300 to-orange-200 text-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold mb-2">Livrabile Proiect</h1>
              <p className="text-pink-100/90 text-sm font-medium">Gestionează resursele și demo-urile pentru acest proiect.</p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white font-bold text-sm transition-all border border-white/20 flex items-center gap-2"
            >
              <span>&larr;</span> Înapoi la Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Coloana Stanga: Lista Livrabile */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-xl shadow-orange-100/50 border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  📦 Resurse Încărcate
                  <span className="bg-white text-orange-600 px-2 py-0.5 rounded-md text-xs border border-orange-100">{deliverables.length}</span>
                </h2>
              </div>

              <div className="p-6">
                {deliverables.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                    <p>Nu există livrabile încărcate.</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {deliverables.map((d) => (
                      <li key={d.id} className="group bg-white border border-gray-100 rounded-xl p-5 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-500/5 transition-all duration-300">
                        <div className="flex justify-between items-start gap-4">
                          <div className="overflow-hidden">
                            <a
                              href={d.resourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-rose-600 font-bold hover:text-orange-600 hover:underline truncate block text-lg transition-colors"
                            >
                              {d.resourceUrl}
                            </a>
                            <p className="text-gray-600 mt-2 leading-relaxed">{d.description}</p>
                            <span className="text-xs font-semibold text-gray-400 mt-3 block flex items-center gap-1">
                              📅 {new Date(d.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <button
                            onClick={() => navigate(`/grade/${d.id}`)}
                            className="shrink-0 bg-gradient-to-r from-orange-300 to-rose-300 text-white text-xs font-bold px-4 py-2 rounded-lg hover:shadow-md hover:scale-105 transition-all shadow-sm"
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
          {project?.ownerId == currentUser.id && (
            <div>
              <div className="bg-white rounded-2xl shadow-xl shadow-rose-100/50 border border-rose-100 p-6 sticky top-6">
                <h2 className="font-bold text-gray-800 mb-4 text-lg border-b border-gray-100 pb-2">➕ Adaugă Resursă</h2>

                {message && (
                  <div className={`mb-4 p-3 rounded-xl text-sm font-medium border ${message.includes("succes") ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">Link (Video/Repo)</label>
                    <input
                      type="url"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition font-medium"
                      placeholder="https://..."
                      value={formData.resourceUrl}
                      onChange={(e) => setFormData({ ...formData, resourceUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">Descriere</label>
                    <textarea
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition resize-none"
                      rows="3"
                      required
                      placeholder="Ce reprezintă acest link?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                  <button className="w-full bg-gradient-to-r from-rose-400 to-orange-400 text-white font-bold py-2.5 rounded-xl hover:shadow-orange-200/50 shadow-lg shadow-rose-200/50 active:scale-95 transition-all">
                    Adaugă Resursă
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
