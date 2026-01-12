import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createData, setCreateData] = useState({ title: "", description: "", githubRepo: "" });
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchMyProjects();
  }, []);

  async function fetchMyProjects() {
    try {
      const res = await api.get("/api/projects/my-projects");
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
      fetchMyProjects(); // Refresh list
    } catch (err) {
      setMessage("Eroare la creare proiect.");
    }
  }

  if (loading) return <div>Se încarcă...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-gray-800">Salut, {user.fullName}!</h1>
        <p className="text-gray-500">Bun venit în panoul de control.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Coloana Stanga: Proiectele Mele */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Proiectele Mele</h2>

          {projects.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg border text-center text-gray-500">
              Nu ai niciun proiect încă. Creează unul!
            </div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{p.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {/* Aici vom pune butoane pt Livrabile mai incolo */}
              </div>
            ))
          )}
        </div>

        {/* Coloana Dreapta: Adauga Proiect */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
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
              <label className="block text-sm font-medium mb-1">Repo GitHub (ex: facebook/react)</label>
              <input
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="user/repo"
                value={createData.githubRepo}
                onChange={e => setCreateData({ ...createData, githubRepo: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Opțional: preluam automat nr star-uri.</p>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Creează Proiect
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
