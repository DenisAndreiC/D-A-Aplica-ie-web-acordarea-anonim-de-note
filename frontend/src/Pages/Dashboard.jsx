import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ProjectCard({ project, isProfessor, onAutoAssign }) {
  const [average, setAverage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/grades/project/${project.id}/average`)
      .then(res => setAverage(res.data.average))
      .catch(() => setAverage(0));
  }, [project.id]);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
            {isProfessor && project.owner && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                  {project.owner.fullName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-purple-600">{project.owner.fullName}</span>
              </div>
            )}
          </div>
          <span className="text-xs font-medium bg-gray-50 text-gray-500 px-3 py-1 rounded-full border border-gray-200">
            {new Date(project.createdAt).toLocaleDateString("ro-RO")}
          </span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 h-16">
          {project.description || "Fără descriere."}
        </p>

        <div className="flex items-center gap-3">
          {/* Media */}
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${average > 0 ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-400"
            }`}>
            <span className="text-xs uppercase font-bold tracking-wider">Media</span>
            <span className="font-bold text-lg">{average > 0 ? average : '-'}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
        <button
          onClick={() => navigate(`/projects/${project.id}/deliverables`)}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
        >
          Livrabile <span className="text-lg relative top-[1px]">&rarr;</span>
        </button>

        {isProfessor && (
          <button
            onClick={() => onAutoAssign(project.id)}
            className="text-xs font-bold bg-white border border-purple-200 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all shadow-sm"
          >
            🎲 Alocă Juriu
          </button>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createData, setCreateData] = useState({ title: "", description: "", githubRepo: "" });
  const [message, setMessage] = useState("");
  // ... (state existing)
  const [juryProjects, setJuryProjects] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isProfessor = user.role === 'PROFESSOR';

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

  async function fetchProjects() {
    try {
      const endpoint = isProfessor ? "/api/projects" : "/api/projects/my-projects";
      const res = await api.get(endpoint);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ... (fetchJuryProjects same)
  async function fetchJuryProjects() {
    try {
      const res = await api.get("/api/jury/my-jury-projects");
      setJuryProjects(res.data);
    } catch (err) {
      console.error("Eroare incarcare proiecte juriu", err);
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-indigo-50/50 pb-20">
      {/* Top Banner Gradient - Darker for better contrast */}
      <div className={`h-64 ${isProfessor ? 'bg-gradient-to-r from-indigo-900 to-purple-800' : 'bg-gradient-to-br from-blue-800 to-indigo-900'} w-full absolute top-0 left-0 z-0 shadow-lg`}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Content */}
        <div className="pt-12 pb-12 text-white flex justify-between items-end">
          <div>
            <p className="text-blue-200 font-medium tracking-wide text-xs uppercase mb-2">Bine ai venit</p>
            <h1 className="text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">{user.fullName}</h1>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
              <span className="text-2xl">{isProfessor ? '👨‍🏫' : '👨‍🎓'}</span>
              <span className="text-sm font-semibold text-white/90">{isProfessor ? 'Mod Profesor' : 'Mod Student'}</span>
            </div>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all text-sm font-medium text-white/90 hover:text-white"
          >
            <span>Deconectare</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>

        {/* JURY SECTION */}
        {juryProjects.length > 0 && (
          <div className="mb-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-200/60 ring-1 ring-black/5">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                ⚡ Proiecte de Notat
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full border border-amber-200">{juryProjects.length}</span>
              </h2>
            </div>
            <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {juryProjects.map(p => (
                <div key={p.id} className="group bg-white border border-gray-200 hover:border-amber-300 p-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-amber-700 transition-colors">{p.title}</h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/projects/${p.id}/deliverables`)}
                    className="mt-5 w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                  >
                    <span>Acordă Notă</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN LAYOUT */}
        <div className={`grid ${isProfessor ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>

          {/* PROJECTS SECTION */}
          <div className={`${isProfessor ? '' : 'lg:col-span-2'} space-y-6`}>
            <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-white/60 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {isProfessor ? '📚 Catalog Proiecte' : '📂 Proiectele Mele'}
                <span className="text-sm font-normal text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-md">{projects.length} proiecte</span>
              </h2>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 shadow-sm">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📂</div>
                <h3 className="text-lg font-bold text-gray-900">Nu ai niciun proiect</h3>
                <p className="text-gray-500 mt-1 max-w-sm mx-auto">Începe prin a crea primul tău proiect folosind formularul.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    isProfessor={isProfessor}
                    onAutoAssign={handleAutoAssign}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CREATE PROJECT FORM (STUDENT ONLY) */}
          {!isProfessor && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100 overflow-hidden sticky top-8 border border-indigo-50">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 border-b border-indigo-100 flex items-center gap-2 text-white">
                  <h2 className="text-lg font-bold">🚀 Proiect Nou</h2>
                </div>
                <div className="p-6 bg-white">
                  {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm font-medium border ${message.includes("succes") ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">Titlu Proiect</label>
                      <input
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 font-medium"
                        value={createData.title}
                        onChange={e => setCreateData({ ...createData, title: e.target.value })}
                        required
                        placeholder="Ex: Platforma E-Learning"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">Descriere</label>
                      <textarea
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none placeholder-gray-400"
                        rows="4"
                        value={createData.description}
                        onChange={e => setCreateData({ ...createData, description: e.target.value })}
                        placeholder="Descrie funcționalitățile principale..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">GitHub Repo</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
                        </span>
                        <input
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 pl-9 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 font-mono text-sm"
                          placeholder="username/repository"
                          value={createData.githubRepo}
                          onChange={e => setCreateData({ ...createData, githubRepo: e.target.value })}
                        />
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/30 mt-2 flex items-center justify-center gap-2">
                      <span>Creează Proiect</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
