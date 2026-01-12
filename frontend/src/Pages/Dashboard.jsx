import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createData, setCreateData] = useState({ title: "", description: "", githubRepo: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isProfessor = user.role === 'PROFESSOR';

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      // Daca e profesor, luam toate proiectele. Daca e student, doar ale lui.
      const endpoint = isProfessor ? "/api/projects" : "/api/projects/my-projects";
      const res = await api.get(endpoint);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/api/projects", createData);
      setMessage("Proiect creat cu succes!");
      setCreateData({ title: "", description: "", githubRepo: "" });
      fetchProjects(); // Refresh list
    } catch (err) {
      setMessage(err.response?.data?.error || "Eroare la creare proiect.");
    }
  }

  if (loading) return <div>Se încarcă...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-600">
        <h1 className="text-2xl font-bold text-gray-800">Salut, {user.fullName}! ({user.role})</h1>
        <p className="text-gray-500">
          {isProfessor
            ? "Aici poți vedea toate proiectele studenților."
            : "Bun venit în panoul de control."}
        </p>
      </div>

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
                    {/* Placeholder pentru buton de notare (doar pt profesor/juriu) */}
                    {/* {isProfessor && <button className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded">Notează</button>} */}
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
