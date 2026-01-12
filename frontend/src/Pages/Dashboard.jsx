import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createData, setCreateData] = useState({ title: "", description: "", githubRepo: "" });
  const [message, setMessage] = useState("");
  // ... (state existing)
  const [juryProjects, setJuryProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchJuryProjects();
  }, []);

  async function handleAutoAssign(projectId) {
    if (!window.confirm("Sigur vrei să aloci automat juriul pentru acest proiect?")) return;

    try {
      const res = await api.post("/api/jury/auto-assign", { projectId });
      alert(res.data.message + "\nJurați: " + res.data.jurors.join(", "));
    } catch (err) {
      alert(err.response?.data?.error || "Eroare la alocare.");
    }
  }

  // ... (fetchProjects existing)

  async function fetchJuryProjects() {
    try {
      const res = await api.get("/api/jury/my-jury-projects");
      setJuryProjects(res.data);
    } catch (err) {
      console.error("Eroare incarcare proiecte juriu", err);
    }
  }

  // ... (handlCreate existing)

  return (
    <div className="space-y-8">
      {/* Header existing ... */}

      {/* Sectiune Juriu - Apare doar daca ai proiecte de notat */}
      {juryProjects.length > 0 && (
        <div className="bg-yellow-50 p-6 rounded-xl shadow border border-yellow-200">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">Proiecte de Notat ({juryProjects.length})</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {juryProjects.map(p => (
              <div key={p.id} className="bg-white p-4 rounded shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </div>
                <button
                  onClick={() => navigate(`/projects/${p.id}/deliverables`)} // Momentan trimitem la livrabile, de acolo se va nota
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Notează
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Principal */}
      <div className={`grid ${isProfessor ? 'grid-cols-1' : 'md:grid-cols-3'} gap-6`}>
        {/* Coloana Proiecte: ocupa tot spatiul pt profesori, sau 2/3 pt studenti */}
        <div className={`${isProfessor ? '' : 'md:col-span-2'} space-y-4`}>
          <h2 className="text-xl font-semibold">
            {isProfessor ? 'Toate Proiectele' : 'Proiectele Mele'}
          </h2>

          {projects.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg border text-center text-gray-500">
              Nu există proiecte momentan.
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-blue-900">{p.title}</h3>
                      {/* Afisam autorul daca e profesor */}
                      {isProfessor && p.owner && (
                        <p className="text-sm font-semibold text-purple-600">Autor: {p.owner.fullName}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1 break-words">{p.description}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded shrink-0 ml-2">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-4 border-t pt-3 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/projects/${p.id}/deliverables`)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Vezi Livrabile &rarr;
                    </button>

                    {/* Buton Alocare Juriu (DOAR PROFESOR) */}
                    {isProfessor && (
                      <button
                        onClick={() => handleAutoAssign(p.id)}
                        className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 border border-purple-200"
                      >
                        🎲 Alocă Juriu
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formular Adaugare PROIECT - Doar pentru STUDENTI */}
        {!isProfessor && (
          <div className="bg-white p-6 rounded-xl shadow h-fit border">
            <h2 className="text-xl font-semibold mb-4">Adaugă Proiect</h2>
            {message && <div className="mb-3 text-sm p-2 bg-blue-50 text-blue-700 rounded">{message}</div>}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titlu Proiect</label>
                <input
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={createData.title}
                  onChange={e => setCreateData({ ...createData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descriere</label>
                <textarea
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                  value={createData.description}
                  onChange={e => setCreateData({ ...createData, description: e.target.value })}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Repo GitHub</label>
                <input
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="user/repo"
                  value={createData.githubRepo}
                  onChange={e => setCreateData({ ...createData, githubRepo: e.target.value })}
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                Creează Proiect
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
