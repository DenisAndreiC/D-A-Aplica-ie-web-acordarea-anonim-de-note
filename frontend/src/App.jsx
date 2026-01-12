import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Projects from "./Pages/Projects.jsx";
import Deliverables from "./Pages/Deliverables.jsx";
import Grade from "./Pages/Grade.jsx";
import NotFound from "./Pages/NotFound.jsx";

export default function App() {
  const location = useLocation(); // Force re-render on route change
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg text-blue-900">Acordare anonimă de note</Link>
          <nav className="flex gap-4 text-sm font-medium">
            {!user ? (
              <>
                <Link className="px-3 py-2 rounded hover:bg-gray-100 transition" to="/login">Autentificare</Link>
                <Link className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm" to="/register">Înregistrare</Link>
              </>
            ) : (
              <Link className="px-3 py-2 rounded hover:bg-gray-100 transition" to="/dashboard">Dashboard</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId/deliverables" element={<Deliverables />} />
          <Route path="/grade/:deliverableId" element={<Grade />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
